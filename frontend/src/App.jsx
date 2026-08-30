import { useEffect, useRef, useState } from 'react'

import {
  LayoutDashboard,
  ChartNoAxesCombined,
  BarChart3,
  ReceiptText,
  Upload,
  CalendarDays,
  WalletCards,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Activity,
  FileUp,
  FileText,
} from 'lucide-react'

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

import './App.css'


const API_URL = 'http://localhost:8000'


async function buscarDadosDashboard() {
  const [respostaFluxo, respostaTransacoes] = await Promise.all([
    fetch(
      `${API_URL}/fluxo-caixa?data_inicio=2026-08-24&data_fim=2026-08-25`
    ),

    fetch(
      `${API_URL}/transacoes`
    ),
  ])


  if (!respostaFluxo.ok || !respostaTransacoes.ok) {
    throw new Error(
      'Não foi possível carregar os dados do dashboard.'
    )
  }


  const dadosFluxo = await respostaFluxo.json()
  const dadosTransacoes = await respostaTransacoes.json()


  return {
    fluxo: dadosFluxo,
    transacoes: Array.isArray(dadosTransacoes.transacoes)
      ? dadosTransacoes.transacoes
      : [],
  }
}


function App() {
  const [fluxo, setFluxo] = useState(null)
  const [transacoes, setTransacoes] = useState([])

  const [erroDados, setErroDados] = useState(false)

  const [importando, setImportando] = useState(false)

  const [
    mensagemImportacao,
    setMensagemImportacao,
  ] = useState('')

  const [
    erroImportacao,
    setErroImportacao,
  ] = useState('')


  const inputArquivoRef = useRef(null)


  useEffect(() => {
    let componenteAtivo = true


    async function carregarDadosIniciais() {
      try {
        const dados = await buscarDadosDashboard()

        if (componenteAtivo) {
          setFluxo(dados.fluxo)
          setTransacoes(dados.transacoes)
          setErroDados(false)
        }
      } catch (erro) {
        console.error(erro)

        if (componenteAtivo) {
          setErroDados(true)
        }
      }
    }


    carregarDadosIniciais()


    return () => {
      componenteAtivo = false
    }
  }, [])


  function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor)
  }


  function formatarData(data) {
    const [ano, mes, dia] = data.split('-')

    return `${dia}/${mes}/${ano}`
  }


  async function importarArquivo(event) {
    const input = event.target
    const arquivo = input.files?.[0]


    if (!arquivo) {
      return
    }


    setImportando(true)
    setMensagemImportacao('')
    setErroImportacao('')


    try {
      const formulario = new FormData()

      formulario.append(
        'arquivo',
        arquivo
      )


      const resposta = await fetch(
        `${API_URL}/importar`,
        {
          method: 'POST',
          body: formulario,
        }
      )


      if (!resposta.ok) {
        let mensagemErro =
          'Não foi possível importar o arquivo.'


        try {
          const dadosErro = await resposta.json()

          if (typeof dadosErro.detail === 'string') {
            mensagemErro = dadosErro.detail
          }
        } catch {
          // Mantém a mensagem padrão
        }


        throw new Error(mensagemErro)
      }


      await resposta.json()


      const dadosAtualizados =
        await buscarDadosDashboard()


      setFluxo(
        dadosAtualizados.fluxo
      )

      setTransacoes(
        dadosAtualizados.transacoes
      )

      setErroDados(false)


      setMensagemImportacao(
        `Arquivo "${arquivo.name}" processado com sucesso.`
      )
    } catch (erro) {
      console.error(erro)

      setErroImportacao(
        erro.message ||
          'Erro ao importar o arquivo.'
      )
    } finally {
      setImportando(false)

      input.value = ''
    }
  }


  const dadosGrafico = fluxo
    ? fluxo.diario.map((item) => ({
        data: new Date(
          `${item.data}T00:00:00`
        ).toLocaleDateString(
          'pt-BR',
          {
            day: '2-digit',
            month: '2-digit',
          }
        ),

        saldo: item.saldo_acumulado,
      }))
    : []


  const temAlertas =
    fluxo &&
    fluxo.alertas.length > 0


  const saldoNegativo =
    fluxo &&
    fluxo.saldo < 0


  const alertaDespesa =
    fluxo?.alertas.some(
      (alerta) =>
        alerta.tipo ===
        'despesa_acima_da_media'
    )


  const transacoesRecentes =
    [...transacoes]
      .sort((a, b) => {
        const diferencaData =
          new Date(
            `${b.data}T00:00:00`
          ) -
          new Date(
            `${a.data}T00:00:00`
          )


        if (diferencaData !== 0) {
          return diferencaData
        }


        return b.id - a.id
      })
      .slice(0, 4)


  const textoCarregamento =
    erroDados
      ? 'Erro ao carregar'
      : 'Carregando...'


  return (
    <div className="app-shell">

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">
            <ChartNoAxesCombined size={21} />
          </div>

          <div>
            <strong>CashFlow</strong>
            <span>Analytics</span>
          </div>

        </div>


        <nav className="sidebar-nav">

          <button className="nav-item active">
            <LayoutDashboard size={18} />
            <span>Visão geral</span>
          </button>

          <button className="nav-item">
            <ChartNoAxesCombined size={18} />
            <span>Fluxo de caixa</span>
          </button>

          <button className="nav-item">
            <BarChart3 size={18} />
            <span>Análises</span>
          </button>

          <button className="nav-item">
            <ReceiptText size={18} />
            <span>Transações</span>
          </button>

          <button className="nav-item">
            <Upload size={18} />
            <span>Importar dados</span>
          </button>

        </nav>


        <div className="sidebar-note">
          <p>
            Dados fictícios utilizados para testes e demonstração.
          </p>
        </div>

      </aside>


      <main className="main-content">

        <header className="page-header">

          <div>

            <h1>
              <span className="brand-highlight">
                CashFlow
              </span>{' '}
              Analytics
            </h1>

            <p className="page-subtitle">
              Análise e monitoramento de fluxo de caixa
            </p>

          </div>


          <button className="period-selector">
            <CalendarDays size={17} />
            <span>Agosto 2026</span>
          </button>

        </header>


        <section className="kpi-grid">

          <article className="kpi-card">

            <div className="kpi-header">

              <span>Saldo</span>

              <div className="kpi-icon violet">
                <WalletCards size={19} />
              </div>

            </div>


            <strong className="kpi-value">
              {fluxo
                ? formatarMoeda(
                    fluxo.saldo
                  )
                : textoCarregamento}
            </strong>


            <span className="kpi-caption">
              Saldo no período selecionado
            </span>

          </article>


          <article className="kpi-card">

            <div className="kpi-header">

              <span>Entradas</span>

              <div className="kpi-icon green">
                <ArrowUpRight size={19} />
              </div>

            </div>


            <strong className="kpi-value">
              {fluxo
                ? formatarMoeda(
                    fluxo.entradas
                  )
                : textoCarregamento}
            </strong>


            <span className="kpi-caption positive">
              Fluxo positivo registrado
            </span>

          </article>


          <article className="kpi-card">

            <div className="kpi-header">

              <span>Saídas</span>

              <div className="kpi-icon coral">
                <ArrowDownRight size={19} />
              </div>

            </div>


            <strong className="kpi-value">
              {fluxo
                ? formatarMoeda(
                    fluxo.saidas
                  )
                : textoCarregamento}
            </strong>


            <span className="kpi-caption negative">
              Total de despesas no período
            </span>

          </article>


          <article className="kpi-card">

            <div className="kpi-header">

              <span>Cobertura</span>

              <div className="kpi-icon violet">
                <ShieldCheck size={19} />
              </div>

            </div>


            <strong className="kpi-value">
              {!fluxo
                ? textoCarregamento
                : fluxo.cobertura === null
                  ? '—'
                  : `${fluxo.cobertura
                      .toFixed(2)
                      .replace('.', ',')}x`
              }
            </strong>


            <span className="kpi-caption">
              Entradas em relação às saídas
            </span>

          </article>

        </section>


        <section className="dashboard-row">

          <article className="dashboard-card chart-card">

            <div className="card-title-row">

              <div>

                <h2>
                  Evolução do caixa
                </h2>

                <p>
                  Saldo acumulado ao longo do período
                </p>

              </div>


              <div className="small-icon violet-soft">
                <Activity size={18} />
              </div>

            </div>


            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <AreaChart
                  data={dadosGrafico}
                  margin={{
                    top: 12,
                    right: 8,
                    left: -10,
                    bottom: 0,
                  }}
                >

                  <defs>

                    <linearGradient
                      id="saldoGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#6d3fc6"
                        stopOpacity={0.22}
                      />

                      <stop
                        offset="100%"
                        stopColor="#6d3fc6"
                        stopOpacity={0.02}
                      />

                    </linearGradient>

                  </defs>


                  <CartesianGrid
                    stroke="#eeeae3"
                    strokeDasharray="4 4"
                    vertical={false}
                  />


                  <XAxis
                    dataKey="data"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: '#777985',
                      fontSize: 11,
                    }}
                    dy={8}
                  />


                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: '#777985',
                      fontSize: 11,
                    }}
                    tickFormatter={(value) =>
                      `R$ ${value}`
                    }
                  />


                  <Tooltip
                    cursor={{
                      stroke: '#d7c9eb',
                      strokeDasharray: '4 4',
                    }}

                    contentStyle={{
                      border:
                        '1px solid #ece9e2',
                      borderRadius: '9px',
                      boxShadow:
                        '0 6px 18px rgba(20, 20, 20, 0.08)',
                      fontSize: '12px',
                    }}

                    formatter={(value) => [
                      `R$ ${Number(
                        value
                      ).toLocaleString(
                        'pt-BR'
                      )}`,
                      'Saldo',
                    ]}
                  />


                  <Area
                    type="monotone"
                    dataKey="saldo"
                    stroke="#6d3fc6"
                    strokeWidth={2.5}
                    fill="url(#saldoGradient)"
                    activeDot={{
                      r: 5,
                      fill: '#6d3fc6',
                      stroke: '#ffffff',
                      strokeWidth: 2,
                    }}
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

          </article>


          <article className="dashboard-card monitoring-card">

            <div className="card-title-row">

              <div>

                <h2>
                  Alertas e monitoramento
                </h2>

                <p>
                  Acompanhamento da saúde financeira
                </p>

              </div>


              <div
                className={
                  `small-icon ${
                    temAlertas
                      ? 'coral-soft'
                      : 'green-soft'
                  }`
                }
              >
                <ShieldCheck size={18} />
              </div>

            </div>


            <div
              className={
                `health-status ${
                  temAlertas
                    ? 'warning'
                    : ''
                }`
              }
            >

              <div
                className={
                  `health-status-icon ${
                    temAlertas
                      ? 'warning'
                      : ''
                  }`
                }
              >

                {temAlertas
                  ? (
                    <AlertTriangle
                      size={21}
                    />
                  )
                  : (
                    <CheckCircle2
                      size={21}
                    />
                  )
                }

              </div>


              <div>

                <span className="health-label">
                  Situação atual
                </span>


                <strong>
                  {temAlertas
                    ? 'Atenção necessária'
                    : 'Fluxo saudável'
                  }
                </strong>


                <p>
                  {temAlertas
                    ? `${fluxo.alertas.length} alerta(s) identificado(s) no período.`
                    : 'Nenhum risco crítico detectado no período.'
                  }
                </p>

              </div>

            </div>


            <div className="monitor-list">

              <div className="monitor-item">

                {saldoNegativo
                  ? (
                    <AlertTriangle
                      className="monitor-warning-icon"
                      size={17}
                    />
                  )
                  : (
                    <CheckCircle2
                      size={17}
                    />
                  )
                }


                <div>

                  <strong>
                    {saldoNegativo
                      ? 'Saldo negativo'
                      : 'Saldo positivo'
                    }
                  </strong>


                  <span>
                    {fluxo
                      ? `O período apresenta saldo de ${formatarMoeda(fluxo.saldo)}.`
                      : 'Carregando informações...'
                    }
                  </span>

                </div>

              </div>


              <div className="monitor-item">

                <CheckCircle2
                  size={17}
                />


                <div>

                  <strong>
                    Cobertura financeira
                  </strong>


                  <span>
                    {fluxo &&
                    fluxo.cobertura !== null
                      ? `As entradas cobrem ${fluxo.cobertura
                          .toFixed(2)
                          .replace('.', ',')}x o total de saídas.`
                      : 'Sem saídas suficientes para calcular a cobertura.'
                    }
                  </span>

                </div>

              </div>


              <div className="monitor-item">

                {alertaDespesa
                  ? (
                    <AlertTriangle
                      className="monitor-warning-icon"
                      size={17}
                    />
                  )
                  : (
                    <CheckCircle2
                      size={17}
                    />
                  )
                }


                <div>

                  <strong>
                    Despesas monitoradas
                  </strong>


                  <span>
                    {alertaDespesa
                      ? 'Foi identificada uma despesa significativamente acima da média.'
                      : 'Nenhuma anomalia relevante foi identificada.'
                    }
                  </span>

                </div>

              </div>


              {fluxo?.alertas.map(
                (alerta, index) => (

                  <div
                    className="monitor-item alert-message"
                    key={
                      `${alerta.tipo}-${index}`
                    }
                  >

                    <AlertTriangle
                      size={17}
                    />


                    <div>

                      <strong>
                        Alerta
                      </strong>

                      <span>
                        {alerta.mensagem}
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          </article>

        </section>


        <section className="dashboard-row bottom-row">

          <article className="dashboard-card transactions-card">

            <div className="card-title-row">

              <div>

                <h2>
                  Transações recentes
                </h2>

                <p>
                  Últimas movimentações registradas
                </p>

              </div>


              <div className="small-icon violet-soft">
                <ReceiptText size={18} />
              </div>

            </div>


            <div className="table-wrapper">

              <table className="transactions-table">

                <thead>

                  <tr>

                    <th>
                      Data
                    </th>

                    <th>
                      Descrição
                    </th>

                    <th>
                      Tipo
                    </th>

                    <th className="value-column">
                      Valor
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {transacoesRecentes.map(
                    (transacao) => {

                      const entrada =
                        transacao.tipo ===
                        'entrada'


                      return (
                        <tr
                          key={
                            transacao.id
                          }
                        >

                          <td>
                            {formatarData(
                              transacao.data
                            )}
                          </td>


                          <td>
                            {
                              transacao.descricao
                            }
                          </td>


                          <td>

                            <span
                              className={
                                `transaction-type ${
                                  entrada
                                    ? 'entrance'
                                    : 'expense'
                                }`
                              }
                            >
                              {entrada
                                ? 'Entrada'
                                : 'Saída'
                              }
                            </span>

                          </td>


                          <td
                            className={
                              `transaction-value ${
                                entrada
                                  ? 'entrance-value'
                                  : 'expense-value'
                              }`
                            }
                          >
                            {entrada
                              ? '+ '
                              : '- '
                            }

                            {formatarMoeda(
                              transacao.valor
                            )}
                          </td>

                        </tr>
                      )
                    }
                  )}

                </tbody>

              </table>

            </div>

          </article>


          <article className="dashboard-card import-card">

            <div className="card-title-row">

              <div>

                <h2>
                  Importar transações
                </h2>

                <p>
                  Atualize os dados financeiros através de CSV
                </p>

              </div>


              <div className="small-icon violet-soft">
                <FileUp size={18} />
              </div>

            </div>


            <div className="upload-area">

              <div className="upload-icon">
                <FileText size={27} />
              </div>


              <strong>
                Importe seu arquivo CSV
              </strong>


              <p>
                Selecione um arquivo contendo data,
                descrição, tipo e valor.
              </p>


              <input
                ref={inputArquivoRef}
                className="file-input"
                type="file"
                accept=".csv,text/csv"
                onChange={importarArquivo}
                disabled={importando}
              />


              <button
                className="upload-button"
                type="button"
                disabled={importando}
                onClick={() =>
                  inputArquivoRef.current?.click()
                }
              >

                <Upload size={16} />

                {importando
                  ? 'Importando...'
                  : 'Selecionar arquivo'
                }

              </button>


              <span className="upload-hint">
                Formato aceito: .csv
              </span>


              {mensagemImportacao && (
                <span className="upload-feedback success">
                  {mensagemImportacao}
                </span>
              )}


              {erroImportacao && (
                <span className="upload-feedback error">
                  {erroImportacao}
                </span>
              )}

            </div>

          </article>

        </section>

      </main>

    </div>
  )
}


export default App
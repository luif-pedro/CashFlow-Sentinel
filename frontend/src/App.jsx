import { useCallback, useEffect, useState } from 'react'

import Sidebar from './components/Sidebar'
import Header from './components/Header'
import KpiGrid from './components/KpiGrid'
import CashFlowChart from './components/CashFlowChart'
import MonitoringPanel from './components/MonitoringPanel'
import TransactionsTable from './components/TransactionsTable'
import TransactionsView from './components/TransactionsView'
import CsvImporter from './components/CsvImporter'

import { buscarDadosDashboard } from './services/api'

import './App.css'


function App() {
  const [fluxo, setFluxo] = useState(null)
  const [transacoes, setTransacoes] = useState([])
  const [erroDados, setErroDados] = useState(false)

  const [dataInicio, setDataInicio] =
    useState('2025-12-01')

  const [dataFim, setDataFim] =
    useState('2025-12-31')

  const [telaAtiva, setTelaAtiva] =
    useState('visao-geral')

  const [itemAtivo, setItemAtivo] =
    useState('visao-geral')


  const carregarDados = useCallback(async () => {
    try {
      const dados = await buscarDadosDashboard(
        dataInicio,
        dataFim
      )

      setFluxo(dados.fluxo)
      setTransacoes(dados.transacoes)
      setErroDados(false)
    } catch (erro) {
      console.error(erro)
      setErroDados(true)
    }
  }, [dataInicio, dataFim])


  useEffect(() => {
    carregarDados()
  }, [carregarDados])


  function aplicarPeriodo(
    novaDataInicio,
    novaDataFim
  ) {
    setDataInicio(novaDataInicio)
    setDataFim(novaDataFim)
  }


  function navegar(secao) {
    if (secao === 'transacoes') {
      setTelaAtiva('transacoes')
      setItemAtivo('transacoes')

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      return
    }


    if (secao === 'analises') {
      setTelaAtiva('analises')
      setItemAtivo('analises')

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      return
    }


    if (secao === 'importar-dados') {
      setTelaAtiva('visao-geral')
      setItemAtivo('importar-dados')

      setTimeout(() => {
        const elemento =
          document.getElementById(
            'importar-dados'
          )

        elemento?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 0)

      return
    }


    setTelaAtiva('visao-geral')
    setItemAtivo('visao-geral')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }


  function renderizarConteudo() {
    if (telaAtiva === 'transacoes') {
      return <TransactionsView />
    }


    if (telaAtiva === 'analises') {
      return (
        <section className="powerbi-page">
          <div className="powerbi-page-header">
            <div>
              <h1>Análises</h1>

              <p>
                Visão analítica do desempenho
                financeiro ao longo do período.
              </p>
            </div>
          </div>

          <div className="powerbi-card">
            <iframe
              title="CashFlow Analytics"
              src="https://app.powerbi.com/view?r=eyJrIjoiOWIzYzQ3NDAtYmQ4OS00NWVjLWE4OGYtODI4OWRhZThiNmYyIiwidCI6ImVhYmU2NGM1LTY4ZjUtNGE3Ni04MzAxLTk1NzdhNjc5ZTQ0OSIsImMiOjR9"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </section>
      )
    }


    return (
      <div id="visao-geral">
        <Header
          dataInicio={dataInicio}
          dataFim={dataFim}
          onAplicarPeriodo={aplicarPeriodo}
        />

        <KpiGrid
          fluxo={fluxo}
          erroDados={erroDados}
        />

        <section className="dashboard-columns">
          <div className="dashboard-column">
            <CashFlowChart
              fluxo={fluxo}
            />

            <TransactionsTable
              transacoes={transacoes}
            />
          </div>

          <div className="dashboard-column">
            <MonitoringPanel
              fluxo={fluxo}
            />

            <div id="importar-dados">
              <CsvImporter
                onImportacaoConcluida={
                  carregarDados
                }
              />
            </div>
          </div>
        </section>
      </div>
    )
  }


  return (
    <div className="app-shell">
      <Sidebar
        itemAtivo={itemAtivo}
        onNavegar={navegar}
      />

      <main className="main-content">
        {renderizarConteudo()}
      </main>
    </div>
  )
}


export default App
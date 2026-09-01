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
    useState('2026-08-24')

  const [dataFim, setDataFim] =
    useState('2026-08-25')

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


  return (
    <div className="app-shell">
      <Sidebar
        itemAtivo={itemAtivo}
        onNavegar={navegar}
      />

      <main className="main-content">
        {telaAtiva === 'transacoes' ? (
          <TransactionsView />
        ) : (
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
        )}
      </main>
    </div>
  )
}


export default App
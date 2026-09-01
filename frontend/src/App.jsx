import { useCallback, useEffect, useState } from 'react'

import Sidebar from './components/Sidebar'
import Header from './components/Header'
import KpiGrid from './components/KpiGrid'
import CashFlowChart from './components/CashFlowChart'
import MonitoringPanel from './components/MonitoringPanel'
import TransactionsTable from './components/TransactionsTable'
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


  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
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

            <CsvImporter
              onImportacaoConcluida={carregarDados}
            />
          </div>
        </section>
      </main>
    </div>
  )
}


export default App
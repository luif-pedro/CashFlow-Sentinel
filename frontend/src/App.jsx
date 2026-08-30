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


  const carregarDados = useCallback(async () => {
    try {
      const dados = await buscarDadosDashboard()

      setFluxo(dados.fluxo)
      setTransacoes(dados.transacoes)
      setErroDados(false)
    } catch (erro) {
      console.error(erro)
      setErroDados(true)
    }
  }, [])


  useEffect(() => {
    carregarDados()
  }, [carregarDados])


  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <Header />

        <KpiGrid
          fluxo={fluxo}
          erroDados={erroDados}
        />

        <section className="dashboard-row">
          <CashFlowChart fluxo={fluxo} />
          <MonitoringPanel fluxo={fluxo} />
        </section>

        <section className="dashboard-row bottom-row">
          <TransactionsTable
            transacoes={transacoes}
          />

          <CsvImporter
            onImportacaoConcluida={carregarDados}
          />
        </section>
      </main>
    </div>
  )
}


export default App
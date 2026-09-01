import {
  LayoutDashboard,
  ChartNoAxesCombined,
  BarChart3,
  ReceiptText,
  Upload,
} from 'lucide-react'


function Sidebar({
  itemAtivo,
  onNavegar,
}) {
  return (
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
        <button
          type="button"
          className={`nav-item ${
            itemAtivo === 'visao-geral'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            onNavegar('visao-geral')
          }
        >
          <LayoutDashboard size={18} />
          <span>Visão geral</span>
        </button>


        <button
          type="button"
          className="nav-item"
          disabled
          title="Disponível após a integração com o Power BI"
        >
          <BarChart3 size={18} />
          <span>Análises</span>
        </button>


        <button
          type="button"
          className={`nav-item ${
            itemAtivo === 'transacoes'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            onNavegar('transacoes')
          }
        >
          <ReceiptText size={18} />
          <span>Transações</span>
        </button>


        <button
          type="button"
          className={`nav-item ${
            itemAtivo === 'importar-dados'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            onNavegar('importar-dados')
          }
        >
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
  )
}


export default Sidebar
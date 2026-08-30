import {
  LayoutDashboard,
  ChartNoAxesCombined,
  BarChart3,
  ReceiptText,
  Upload,
} from 'lucide-react'

function Sidebar() {
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
  )
}

export default Sidebar
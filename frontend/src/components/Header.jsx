import { CalendarDays } from 'lucide-react'

function Header() {
  return (
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
  )
}

export default Header
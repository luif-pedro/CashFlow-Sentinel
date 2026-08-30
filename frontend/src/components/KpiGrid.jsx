import {
  WalletCards,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
} from 'lucide-react'

import { formatarMoeda } from '../utils/formatters'

function KpiGrid({ fluxo, erroDados }) {
  const textoCarregamento = erroDados
    ? 'Erro ao carregar'
    : 'Carregando...'

  return (
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
            ? formatarMoeda(fluxo.saldo)
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
            ? formatarMoeda(fluxo.entradas)
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
            ? formatarMoeda(fluxo.saidas)
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
                  .replace('.', ',')}x`}
        </strong>

        <span className="kpi-caption">
          Entradas em relação às saídas
        </span>
      </article>
    </section>
  )
}

export default KpiGrid
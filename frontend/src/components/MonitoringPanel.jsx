import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'

import { formatarMoeda } from '../utils/formatters'

function MonitoringPanel({ fluxo }) {
  const carregando = !fluxo

  const temAlertas =
    fluxo?.alertas?.length > 0

  const saldoNegativo =
    fluxo?.saldo < 0

  const alertaDespesa =
    fluxo?.alertas?.some(
      (alerta) =>
        alerta.tipo === 'despesa_acima_da_media'
    )

  return (
    <article className="dashboard-card monitoring-card">
      <div className="card-title-row">
        <div>
          <h2>Alertas e monitoramento</h2>

          <p>
            Acompanhamento da saúde financeira
          </p>
        </div>

        <div
          className={`small-icon ${
            temAlertas
              ? 'coral-soft'
              : 'green-soft'
          }`}
        >
          <ShieldCheck size={18} />
        </div>
      </div>

      <div
        className={`health-status ${
          temAlertas ? 'warning' : ''
        }`}
      >
        <div
          className={`health-status-icon ${
            temAlertas ? 'warning' : ''
          }`}
        >
          {temAlertas ? (
            <AlertTriangle size={21} />
          ) : (
            <CheckCircle2 size={21} />
          )}
        </div>

        <div>
          <span className="health-label">
            Situação atual
          </span>

          <strong>
            {carregando
              ? 'Carregando...'
              : temAlertas
                ? 'Atenção necessária'
                : 'Fluxo saudável'}
          </strong>

          <p>
            {carregando
              ? 'Consultando dados financeiros.'
              : temAlertas
                ? `${fluxo.alertas.length} alerta(s) identificado(s) no período.`
                : 'Nenhum risco crítico detectado no período.'}
          </p>
        </div>
      </div>

      <div className="monitor-list">
        <div className="monitor-item">
          {saldoNegativo ? (
            <AlertTriangle
              className="monitor-warning-icon"
              size={17}
            />
          ) : (
            <CheckCircle2 size={17} />
          )}

          <div>
            <strong>
              {saldoNegativo
                ? 'Saldo negativo'
                : 'Saldo positivo'}
            </strong>

            <span>
              {fluxo
                ? `O período apresenta saldo de ${formatarMoeda(fluxo.saldo)}.`
                : 'Carregando informações...'}
            </span>
          </div>
        </div>

        <div className="monitor-item">
          <CheckCircle2 size={17} />

          <div>
            <strong>
              Cobertura financeira
            </strong>

            <span>
              {fluxo && fluxo.cobertura !== null
                ? `As entradas cobrem ${fluxo.cobertura
                    .toFixed(2)
                    .replace('.', ',')}x o total de saídas.`
                : 'Sem saídas suficientes para calcular a cobertura.'}
            </span>
          </div>
        </div>

        <div className="monitor-item">
          {alertaDespesa ? (
            <AlertTriangle
              className="monitor-warning-icon"
              size={17}
            />
          ) : (
            <CheckCircle2 size={17} />
          )}

          <div>
            <strong>
              Despesas monitoradas
            </strong>

            <span>
              {alertaDespesa
                ? 'Foi identificada uma despesa significativamente acima da média.'
                : 'Nenhuma anomalia relevante foi identificada.'}
            </span>
          </div>
        </div>

        {fluxo?.alertas?.map(
          (alerta, index) => (
            <div
              className="monitor-item alert-message"
              key={`${alerta.tipo}-${index}`}
            >
              <AlertTriangle size={17} />

              <div>
                <strong>Alerta</strong>

                <span>
                  {alerta.mensagem}
                </span>
              </div>
            </div>
          )
        )}
      </div>
    </article>
  )
}

export default MonitoringPanel
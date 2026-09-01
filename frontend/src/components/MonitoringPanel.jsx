import { useState } from 'react'

import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

import { formatarMoeda } from '../utils/formatters'


function MonitoringPanel({ fluxo }) {
  const [mostrarTodosPicos, setMostrarTodosPicos] =
    useState(false)

  const carregando = !fluxo

  const alertas =
    fluxo?.alertas ?? []


  const alertasCriticos =
    alertas.filter(
      (alerta) =>
        alerta.tipo === 'saldo_negativo' ||
        alerta.tipo === 'saidas_maiores_que_entradas'
    )


  const picosSaida =
    alertas.filter(
      (alerta) =>
        alerta.tipo === 'despesa_acima_da_media'
    )


  const picosVisiveis =
    mostrarTodosPicos
      ? picosSaida
      : []


  const temAlertasCriticos =
    alertasCriticos.length > 0

  const temPicos =
    picosSaida.length > 0

  const saldoNegativo =
    fluxo?.saldo < 0


  function textoAlertasCriticos() {
    const quantidade =
      alertasCriticos.length

    if (quantidade === 1) {
      return '1 alerta financeiro identificado no período.'
    }

    return `${quantidade} alertas financeiros identificados no período.`
  }


  function textoPicos() {
    const quantidade =
      picosSaida.length

    if (quantidade === 1) {
      return '1 pico de saída identificado no período.'
    }

    return `${quantidade} picos de saída identificados no período.`
  }


  function textoDiasComPicos() {
    const quantidade =
      picosSaida.length

    if (quantidade === 1) {
      return '1 dia apresentou saídas acima do padrão do período.'
    }

    return `${quantidade} dias apresentaram saídas acima do padrão do período.`
  }


  function formatarMensagemPico(mensagem) {
    return mensagem.replace(
      /(\d{4})-(\d{2})-(\d{2})/,
      '$3/$2/$1'
    )
  }


  function textoSituacao() {
    if (carregando) {
      return 'Consultando dados financeiros.'
    }

    if (temAlertasCriticos) {
      return textoAlertasCriticos()
    }

    if (temPicos) {
      return textoPicos()
    }

    return 'Nenhum risco crítico detectado no período.'
  }


  return (
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
          className={`small-icon ${
            temAlertasCriticos
              ? 'coral-soft'
              : 'green-soft'
          }`}
        >
          <ShieldCheck size={18} />
        </div>
      </div>


      <div
        className={`health-status ${
          temAlertasCriticos
            ? 'warning'
            : ''
        }`}
      >
        <div
          className={`health-status-icon ${
            temAlertasCriticos
              ? 'warning'
              : ''
          }`}
        >
          {temAlertasCriticos ? (
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
              : temAlertasCriticos
                ? 'Atenção necessária'
                : 'Fluxo saudável'}
          </strong>

          <p>
            {textoSituacao()}
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
          {temPicos ? (
            <Activity
              className="monitor-info-icon"
              size={17}
            />
          ) : (
            <CheckCircle2 size={17} />
          )}

          <div>
            <strong>
              Picos de saída
            </strong>

            <span>
              {temPicos
                ? textoDiasComPicos()
                : 'Nenhum pico relevante de saída foi identificado.'}
            </span>
          </div>
        </div>


        {alertasCriticos.map(
          (alerta, index) => (
            <div
              className="monitor-item alert-message"
              key={`${alerta.tipo}-${index}`}
            >
              <AlertTriangle size={17} />

              <div>
                <strong>
                  Alerta financeiro
                </strong>

                <span>
                  {alerta.mensagem}
                </span>
              </div>
            </div>
          )
        )}


        {picosVisiveis.map(
          (alerta, index) => (
            <div
              className="monitor-item event-message"
              key={`${alerta.tipo}-${index}`}
            >
              <Activity size={17} />

              <div>
                <strong>
                  Pico de saída
                </strong>

                <span>
                  {formatarMensagemPico(
                    alerta.mensagem
                  )}
                </span>
              </div>
            </div>
          )
        )}


        {temPicos && (
          <button
            type="button"
            className="monitor-toggle"
            onClick={() =>
              setMostrarTodosPicos(
                (valorAtual) => !valorAtual
              )
            }
          >
            {mostrarTodosPicos ? (
              <>
                <ChevronUp size={16} />
                Ocultar detalhes
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Ver detalhes dos {picosSaida.length} picos
              </>
            )}
          </button>
        )}
      </div>
    </article>
  )
}


export default MonitoringPanel
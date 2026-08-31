import { useState } from 'react'

import { CalendarDays } from 'lucide-react'


function Header({
  dataInicio = '2026-08-24',
  dataFim = '2026-08-25',
  onAplicarPeriodo,
}) {
  const [painelAberto, setPainelAberto] =
    useState(false)

  const [
    inicioTemporario,
    setInicioTemporario,
  ] = useState(dataInicio)

  const [
    fimTemporario,
    setFimTemporario,
  ] = useState(dataFim)

  const [erroPeriodo, setErroPeriodo] =
    useState('')


  function formatarPeriodo() {
    const [, mesInicio, diaInicio] =
      dataInicio.split('-')

    const [anoFim, mesFim, diaFim] =
      dataFim.split('-')

    return (
      `${diaInicio}/${mesInicio} - ` +
      `${diaFim}/${mesFim}/${anoFim}`
    )
  }


  function abrirPeriodo() {
    setInicioTemporario(dataInicio)
    setFimTemporario(dataFim)
    setErroPeriodo('')

    setPainelAberto(
      (estadoAtual) => !estadoAtual
    )
  }


  function aplicarPeriodo() {
    if (
      !inicioTemporario ||
      !fimTemporario
    ) {
      setErroPeriodo(
        'Selecione as duas datas.'
      )

      return
    }


    if (
      inicioTemporario >
      fimTemporario
    ) {
      setErroPeriodo(
        'A data inicial deve ser anterior à data final.'
      )

      return
    }


    if (
      typeof onAplicarPeriodo ===
      'function'
    ) {
      onAplicarPeriodo(
        inicioTemporario,
        fimTemporario
      )
    }


    setErroPeriodo('')
    setPainelAberto(false)
  }


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


      <div className="period-container">
        <button
          className="period-selector"
          type="button"
          onClick={abrirPeriodo}
        >
          <CalendarDays size={17} />

          <span>
            {formatarPeriodo()}
          </span>
        </button>


        {painelAberto && (
          <div className="period-panel">
            <div className="period-field">
              <label htmlFor="data-inicio">
                Data inicial
              </label>

              <input
                id="data-inicio"
                type="date"
                value={inicioTemporario}
                onChange={(event) =>
                  setInicioTemporario(
                    event.target.value
                  )
                }
              />
            </div>


            <div className="period-field">
              <label htmlFor="data-fim">
                Data final
              </label>

              <input
                id="data-fim"
                type="date"
                value={fimTemporario}
                onChange={(event) =>
                  setFimTemporario(
                    event.target.value
                  )
                }
              />
            </div>


            {erroPeriodo && (
              <span className="period-error">
                {erroPeriodo}
              </span>
            )}


            <div className="period-actions">
              <button
                className="period-cancel"
                type="button"
                onClick={() =>
                  setPainelAberto(false)
                }
              >
                Cancelar
              </button>

              <button
                className="period-apply"
                type="button"
                onClick={aplicarPeriodo}
              >
                Aplicar
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}


export default Header
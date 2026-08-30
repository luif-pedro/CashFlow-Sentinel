import { ReceiptText } from 'lucide-react'

import {
  formatarData,
  formatarMoeda,
} from '../utils/formatters'

function TransactionsTable({ transacoes }) {
  const transacoesRecentes = [...transacoes]
    .sort((a, b) => {
      const diferencaData =
        new Date(`${b.data}T00:00:00`) -
        new Date(`${a.data}T00:00:00`)

      if (diferencaData !== 0) {
        return diferencaData
      }

      return b.id - a.id
    })
    .slice(0, 4)

  return (
    <article className="dashboard-card transactions-card">
      <div className="card-title-row">
        <div>
          <h2>Transações recentes</h2>

          <p>
            Últimas movimentações registradas
          </p>
        </div>

        <div className="small-icon violet-soft">
          <ReceiptText size={18} />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Tipo</th>
              <th className="value-column">
                Valor
              </th>
            </tr>
          </thead>

          <tbody>
            {transacoesRecentes.map(
              (transacao) => {
                const entrada =
                  transacao.tipo === 'entrada'

                return (
                  <tr key={transacao.id}>
                    <td>
                      {formatarData(
                        transacao.data
                      )}
                    </td>

                    <td>
                      {transacao.descricao}
                    </td>

                    <td>
                      <span
                        className={`transaction-type ${
                          entrada
                            ? 'entrance'
                            : 'expense'
                        }`}
                      >
                        {entrada
                          ? 'Entrada'
                          : 'Saída'}
                      </span>
                    </td>

                    <td
                      className={`transaction-value ${
                        entrada
                          ? 'entrance-value'
                          : 'expense-value'
                      }`}
                    >
                      {entrada ? '+ ' : '- '}
                      {formatarMoeda(
                        transacao.valor
                      )}
                    </td>
                  </tr>
                )
              }
            )}
          </tbody>
        </table>
      </div>
    </article>
  )
}

export default TransactionsTable
import { useEffect, useState } from 'react'

import {
  ReceiptText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import { buscarTransacoes } from '../services/api'
import {
  formatarData,
  formatarMoeda,
} from '../utils/formatters'


function TransactionsView() {
  const [transacoes, setTransacoes] =
    useState([])

  const [pagina, setPagina] =
    useState(1)

  const [total, setTotal] =
    useState(0)

  const [totalPaginas, setTotalPaginas] =
    useState(0)

  const [carregando, setCarregando] =
    useState(true)

  const [erro, setErro] =
    useState(false)


  useEffect(() => {
    async function carregarTransacoes() {
      try {
        setCarregando(true)
        setErro(false)

        const dados =
          await buscarTransacoes(
            pagina,
            50
          )

        setTransacoes(
          dados.transacoes
        )

        setTotal(
          dados.total
        )

        setTotalPaginas(
          dados.totalPaginas
        )
      } catch (erroCarregamento) {
        console.error(
          erroCarregamento
        )

        setErro(true)
      } finally {
        setCarregando(false)
      }
    }

    carregarTransacoes()
  }, [pagina])


  function paginaAnterior() {
    setPagina(
      (paginaAtual) =>
        Math.max(
          paginaAtual - 1,
          1
        )
    )
  }


  function proximaPagina() {
    setPagina(
      (paginaAtual) =>
        Math.min(
          paginaAtual + 1,
          totalPaginas
        )
    )
  }


  return (
    <section className="transactions-view">
      <div className="transactions-view-header">
        <div>
          <h1>
            Transações
          </h1>

          <p>
            Consulte todas as movimentações
            registradas no sistema.
          </p>
        </div>

        <div className="transactions-total">
          <ReceiptText size={18} />

          <span>
            {total}
            {' '}
            {total === 1
              ? 'registro'
              : 'registros'}
          </span>
        </div>
      </div>


      <div className="dashboard-card transactions-full-card">
        {carregando ? (
          <div className="transactions-state">
            Carregando transações...
          </div>
        ) : erro ? (
          <div className="transactions-state error">
            Não foi possível carregar
            as transações.
          </div>
        ) : transacoes.length === 0 ? (
          <div className="transactions-state">
            Nenhuma transação encontrada.
          </div>
        ) : (
          <>
            <div className="transactions-table-wrapper">
              <table className="transactions-table transactions-full-table">
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
                  {transacoes.map(
                    (transacao) => (
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
                              transacao.tipo ===
                              'entrada'
                                ? 'entrance'
                                : 'expense'
                            }`}
                          >
                            {transacao.tipo ===
                            'entrada'
                              ? 'Entrada'
                              : 'Saída'}
                          </span>
                        </td>

                        <td
                          className={`transaction-value ${
                            transacao.tipo ===
                            'entrada'
                              ? 'entrance-value'
                              : 'expense-value'
                          }`}
                        >
                          {transacao.tipo ===
                          'entrada'
                            ? '+ '
                            : '- '}

                          {formatarMoeda(
                            transacao.valor
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>


            <div className="transactions-pagination">
              <span>
                Página {pagina}
                {' '}
                de {totalPaginas}
              </span>

              <div className="pagination-actions">
                <button
                  type="button"
                  onClick={paginaAnterior}
                  disabled={pagina === 1}
                >
                  <ChevronLeft size={16} />
                  Anterior
                </button>

                <button
                  type="button"
                  onClick={proximaPagina}
                  disabled={
                    pagina >= totalPaginas
                  }
                >
                  Próxima
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}


export default TransactionsView
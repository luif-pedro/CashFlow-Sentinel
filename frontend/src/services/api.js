const API_URL = 'http://localhost:8000'


export async function buscarDadosDashboard(
  dataInicio = '2026-08-24',
  dataFim = '2026-08-25'
) {
  const respostaFluxo = await fetch(
    `${API_URL}/fluxo-caixa?data_inicio=${dataInicio}&data_fim=${dataFim}`
  )

  const respostaTransacoes = await fetch(
    `${API_URL}/transacoes`
  )


  if (!respostaFluxo.ok || !respostaTransacoes.ok) {
    throw new Error(
      'Não foi possível carregar os dados do dashboard.'
    )
  }


  const dadosFluxo = await respostaFluxo.json()

  const dadosTransacoes =
    await respostaTransacoes.json()


  return {
    fluxo: dadosFluxo,

    transacoes:
      Array.isArray(dadosTransacoes.transacoes)
        ? dadosTransacoes.transacoes
        : [],
  }
}


export async function enviarArquivoCsv(arquivo) {
  const formulario = new FormData()

  formulario.append(
    'arquivo',
    arquivo
  )


  const resposta = await fetch(
    `${API_URL}/importar`,
    {
      method: 'POST',
      body: formulario,
    }
  )


  if (!resposta.ok) {
    let mensagemErro =
      'Não foi possível importar o arquivo.'


    try {
      const dadosErro =
        await resposta.json()


      if (
        typeof dadosErro.detail ===
        'string'
      ) {
        mensagemErro =
          dadosErro.detail
      }
    } catch {
      // Mantém a mensagem padrão.
    }


    throw new Error(mensagemErro)
  }


  return resposta.json()
}
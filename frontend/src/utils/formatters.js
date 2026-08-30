export function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

export function formatarData(data) {
  const [ano, mes, dia] = data.split('-')

  return `${dia}/${mes}/${ano}`
}
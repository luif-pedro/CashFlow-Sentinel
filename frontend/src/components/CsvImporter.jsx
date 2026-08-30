import { useRef, useState } from 'react'

import {
  FileUp,
  FileText,
  Upload,
} from 'lucide-react'

import { enviarArquivoCsv } from '../services/api'


function CsvImporter({ onImportacaoConcluida }) {
  const inputArquivoRef = useRef(null)

  const [importando, setImportando] = useState(false)

  const [mensagemImportacao, setMensagemImportacao] =
    useState('')

  const [erroImportacao, setErroImportacao] =
    useState('')


  async function importarArquivo(event) {
    const input = event.target
    const arquivo = input.files?.[0]

    if (!arquivo) {
      return
    }

    setImportando(true)
    setMensagemImportacao('')
    setErroImportacao('')

    try {
      await enviarArquivoCsv(arquivo)

      await onImportacaoConcluida()

      setMensagemImportacao(
        `Arquivo "${arquivo.name}" processado com sucesso.`
      )
    } catch (erro) {
      console.error(erro)

      setErroImportacao(
        erro.message ||
          'Erro ao importar o arquivo.'
      )
    } finally {
      setImportando(false)

      input.value = ''
    }
  }


  return (
    <article className="dashboard-card import-card">
      <div className="card-title-row">
        <div>
          <h2>Importar transações</h2>

          <p>
            Atualize os dados financeiros através de CSV
          </p>
        </div>

        <div className="small-icon violet-soft">
          <FileUp size={18} />
        </div>
      </div>

      <div className="upload-area">
        <div className="upload-icon">
          <FileText size={27} />
        </div>

        <strong>
          Importe seu arquivo CSV
        </strong>

        <p>
          Selecione um arquivo contendo data,
          descrição, tipo e valor.
        </p>

        <input
          ref={inputArquivoRef}
          className="file-input"
          type="file"
          accept=".csv,text/csv"
          onChange={importarArquivo}
          disabled={importando}
        />

        <button
          className="upload-button"
          type="button"
          disabled={importando}
          onClick={() =>
            inputArquivoRef.current?.click()
          }
        >
          <Upload size={16} />

          {importando
            ? 'Importando...'
            : 'Selecionar arquivo'}
        </button>

        <span className="upload-hint">
          Formato aceito: .csv
        </span>

        {mensagemImportacao && (
          <span className="upload-feedback success">
            {mensagemImportacao}
          </span>
        )}

        {erroImportacao && (
          <span className="upload-feedback error">
            {erroImportacao}
          </span>
        )}
      </div>
    </article>
  )
}

export default CsvImporter
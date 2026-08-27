from fastapi import FastAPI, UploadFile, File, HTTPException

from .database import conectar
from data.importador import importar_transacoes


app = FastAPI()


@app.get("/")
def inicio():
    return {"mensagem": "CashFlow API funcionando!"}


@app.get("/transacoes")
def listar_transacoes():
    conn = conectar()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT id, data, descricao, tipo, valor
            FROM transacoes
            WHERE empresa_id = %s
            ORDER BY id
        """, (1,))

        resultados = cursor.fetchall()

        transacoes = []

        for linha in resultados:
            transacao = {
                "id": linha[0],
                "data": linha[1],
                "descricao": linha[2],
                "tipo": linha[3],
                "valor": float(linha[4])
            }

            transacoes.append(transacao)

        return {"transacoes": transacoes}

    finally:
        cursor.close()
        conn.close()


@app.post("/importar")
def importar_csv(arquivo: UploadFile = File(...)):
    try:
        resultado = importar_transacoes(
            arquivo.file,
            empresa_id=1
        )

        return resultado

    except ValueError as erro:
        raise HTTPException(
            status_code=400,
            detail=str(erro)
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Erro interno ao importar transações."
        )
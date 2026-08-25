from fastapi import FastAPI
from database import conectar

app = FastAPI()


@app.get("/")
def inicio():
    return {"mensagem": "CashFlow API funcionando!"}


@app.get("/transacoes")
def listar_transacoes():
    conn = conectar()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM transacoes")
    resultados = cursor.fetchall()

    transacoes = []

    for linha in resultados:
        transacao = {
            "id": linha[0],
            "data": linha[1],
            "descricao": linha[2],
            "tipo": linha[3],
            "valor": linha[4]
        }

        transacoes.append(transacao)

    print(resultados)

    cursor.close()
    conn.close()

    return {"transacoes": transacoes}
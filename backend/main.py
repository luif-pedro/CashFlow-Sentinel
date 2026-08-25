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

    cursor.close()
    conn.close()

    return {"transacoes": resultados}
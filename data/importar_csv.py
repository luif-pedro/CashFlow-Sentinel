import pandas as pd
import psycopg

df = pd.read_csv("transacoes.csv")

conn = psycopg.connect(
    host="localhost",
    dbname="CashFlow",
    user="postgres",
    password="***REMOVED***"
)

cursor = conn.cursor()

print("CSV lido e banco conectado")

linha = df.iloc[0]

cursor.execute(
    """
    INSERT INTO transacoes (data, descricao, tipo, valor)
    VALUES (%s, %s, %s, %s)
    """,
    (
        linha["data"],
        linha["descricao"],
        linha["tipo"],
        linha["valor"]
    )
)

conn.commit()

print("Primeira transacao importada!")
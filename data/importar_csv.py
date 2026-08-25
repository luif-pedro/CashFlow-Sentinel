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

for _, linha in df.iterrows():
    cursor.execute(
    """
    INSERT INTO transacoes (data, descricao, tipo, valor)
    VALUES (%s, %s, %s, %s)
    ON CONFLICT (data, descricao, tipo, valor) DO NOTHING
    """,
    (
        linha["data"],
        linha["descricao"],
        linha["tipo"],
        linha["valor"]
    )
)

conn.commit()

print("Todas as transacoes foram importadas!")
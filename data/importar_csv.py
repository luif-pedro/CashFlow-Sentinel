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

importadas = 0
duplicadas = 0

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

    if cursor.rowcount == 1:
        importadas += 1
    else:
        duplicadas += 1

conn.commit()

print("Transacoes encontradas:", len(df))
print("Transacoes importadas:", importadas)
print("Transacoes duplicadas:", duplicadas)
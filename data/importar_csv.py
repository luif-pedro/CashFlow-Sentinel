import pandas as pd
import psycopg

from normalizar import normalizar_descricao, gerar_fingerprint


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

empresa_id = 1

for _, linha in df.iterrows():

    descricao = normalizar_descricao(linha["descricao"])

    fingerprint = gerar_fingerprint(
        empresa_id,
        linha["data"],
        descricao,
        linha["tipo"],
        linha["valor"]
    )

    cursor.execute(
        """
        INSERT INTO transacoes (
            empresa_id,
            data,
            descricao,
            tipo,
            valor,
            fingerprint
        )
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (empresa_id, fingerprint) DO NOTHING
        """,
        (
            empresa_id,
            linha["data"],
            descricao,
            linha["tipo"],
            linha["valor"],
            fingerprint
        )
    )

    if cursor.rowcount == 1:
        importadas += 1
    else:
        duplicadas += 1


conn.commit()

cursor.close()
conn.close()

print(f"Transacoes encontradas: {len(df)}")
print(f"Transacoes importadas: {importadas}")
print(f"Transacoes duplicadas: {duplicadas}")
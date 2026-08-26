import psycopg

from normalizar import normalizar_descricao, gerar_fingerprint


conn = psycopg.connect(
    host="localhost",
    dbname="CashFlow",
    user="postgres",
    password="***REMOVED***"
)

cursor = conn.cursor()

cursor.execute("""
    SELECT id, empresa_id, data, descricao, tipo, valor
    FROM transacoes
""")

transacoes = cursor.fetchall()

print(f"Transações encontradas: {len(transacoes)}")

for linha in transacoes:
    id_transacao, empresa_id, data, descricao, tipo, valor = linha

    descricao_normalizada = normalizar_descricao(descricao)

    fingerprint = gerar_fingerprint(
        empresa_id,
        data,
        descricao_normalizada,
        tipo,
        valor
    )

    cursor.execute("""
        UPDATE transacoes
        SET fingerprint = %s
        WHERE id = %s
    """, (fingerprint, id_transacao))

conn.commit()

cursor.close()
conn.close()

print("Fingerprints geradas com sucesso!")
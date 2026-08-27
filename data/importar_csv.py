import pandas as pd
import psycopg

from normalizar import normalizar_descricao, gerar_fingerprint
from validar import validar_dados


conn = None
cursor = None

try:
    df = pd.read_csv("transacoes.csv")

    validar_dados(df)

    conn = psycopg.connect(
        host="localhost",
        dbname="CashFlow",
        user="postgres",
        password="***REMOVED***"
    )

    cursor = conn.cursor()

    print("CSV lido, validado e banco conectado")

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

    print(f"Transacoes encontradas: {len(df)}")
    print(f"Transacoes importadas: {importadas}")
    print(f"Transacoes duplicadas: {duplicadas}")

except (ValueError, pd.errors.ParserError) as erro:
    print(f"Erro de validacao: {erro}")

except psycopg.Error as erro:
    if conn:
        conn.rollback()

    print(f"Erro no banco de dados: {erro}")

except Exception as erro:
    if conn:
        conn.rollback()

    print(f"Erro inesperado: {erro}")

finally:
    if cursor:
        cursor.close()

    if conn:
        conn.close()

    print("Processamento finalizado.")
import pandas as pd

from backend.database import conectar
from .normalizar import normalizar_descricao, gerar_fingerprint
from .validar import validar_dados


def importar_transacoes(arquivo, empresa_id):
    df = pd.read_csv(arquivo)

    validar_dados(df)

    conn = conectar()

    cursor = conn.cursor()

    importadas = 0
    duplicadas = 0

    try:
        for _, linha in df.iterrows():

            descricao = normalizar_descricao(linha["descricao"])
            tipo = str(linha["tipo"]).strip().lower()

            fingerprint = gerar_fingerprint(
                empresa_id,
                linha["data"],
                descricao,
                tipo,
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
                    tipo,
                    linha["valor"],
                    fingerprint
                )
            )

            if cursor.rowcount == 1:
                importadas += 1
            else:
                duplicadas += 1

        conn.commit()

    except Exception:
        conn.rollback()
        raise

    finally:
        cursor.close()
        conn.close()

    return {
        "encontradas": len(df),
        "importadas": importadas,
        "duplicadas": duplicadas
    }
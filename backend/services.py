from .database import conectar


def calcular_fluxo_caixa(empresa_id, data_inicio, data_fim):
    conn = conectar()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT
                COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END), 0),
                COALESCE(SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END), 0)
            FROM transacoes
            WHERE empresa_id = %s
              AND data BETWEEN %s AND %s
            """,
            (empresa_id, data_inicio, data_fim)
        )

        entradas, saidas = cursor.fetchone()

        saldo = entradas - saidas

        return {
            "entradas": entradas,
            "saidas": saidas,
            "saldo": saldo
        }

    finally:
        cursor.close()
        conn.close()

def fluxo_caixa_diario(empresa_id, data_inicio, data_fim):
    conn = conectar()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT
                data,
                COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END), 0),
                COALESCE(SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END), 0)
            FROM transacoes
            WHERE empresa_id = %s
              AND data BETWEEN %s AND %s
            GROUP BY data
            ORDER BY data
            """,
            (empresa_id, data_inicio, data_fim)
        )

        resultados = cursor.fetchall()

        dias = []

        for data, entradas, saidas in resultados:
            dias.append({
                "data": data,
                "entradas": entradas,
                "saidas": saidas,
                "saldo": entradas - saidas
            })

        return dias

    finally:
        cursor.close()
        conn.close()
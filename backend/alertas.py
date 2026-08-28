from decimal import Decimal


def verificar_alertas(resultado, diario=None):
    alertas = []

    if resultado["saldo"] < 0:
        alertas.append({
            "tipo": "saldo_negativo",
            "mensagem": "O saldo do período está negativo."
        })

    if resultado["saidas"] > resultado["entradas"]:
        alertas.append({
            "tipo": "saidas_maiores_que_entradas",
            "mensagem": "As saídas do período são maiores que as entradas."
        })

    if diario:
        saidas_diarias = [dia["saidas"] for dia in diario]
        media_saidas = sum(Decimal(str(valor)) for valor in saidas_diarias) / Decimal(len(saidas_diarias))

        limite = media_saidas * Decimal("1.5")

        for dia in diario:
            if dia["saidas"] > limite:
                alertas.append({
                    "tipo": "despesa_acima_da_media",
                    "mensagem": f"As saídas de {dia['data']} ficaram significativamente acima da média."
            })

    return alertas


def test_despesa_acima_da_media():
    resultado = {
        "entradas": 7000,
        "saidas": 6000,
        "saldo": 1000
    }

    diario = [
        {
            "data": "2026-08-24",
            "saidas": 1000
        },
        {
            "data": "2026-08-25",
            "saidas": 3500
        }
    ]

    alertas = verificar_alertas(resultado, diario)

    assert any(
        alerta["tipo"] == "despesa_acima_da_media"
        for alerta in alertas
    )
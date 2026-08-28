def verificar_alertas(resultado):
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

    return alertas
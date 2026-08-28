def verificar_alertas(saldo):
    alertas = []

    if saldo < 0:
        alertas.append({
            "tipo": "saldo_negativo",
            "mensagem": "O saldo do período está negativo."
        })

    return alertas
from backend.alertas import verificar_alertas


def test_sem_alertas():
    resultado = {
        "entradas": 5500,
        "saidas": 1550,
        "saldo": 3950
    }

    assert verificar_alertas(resultado) == []


def test_saldo_negativo():
    resultado = {
        "entradas": 5000,
        "saidas": 6000,
        "saldo": -1000
    }

    alertas = verificar_alertas(resultado)

    assert any(
        alerta["tipo"] == "saldo_negativo"
        for alerta in alertas
    )


def test_saidas_maiores_que_entradas():
    resultado = {
        "entradas": 5000,
        "saidas": 6000,
        "saldo": -1000
    }

    alertas = verificar_alertas(resultado)

    assert any(
        alerta["tipo"] == "saidas_maiores_que_entradas"
        for alerta in alertas
    )

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
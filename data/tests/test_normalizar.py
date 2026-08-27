from data.normalizar import normalizar_descricao, normalizar_valor, gerar_fingerprint


def test_normalizar_descricao():
    resultado = normalizar_descricao("  VENDA   Cliente A  ")

    assert resultado == "venda cliente a"


def test_normalizar_valor():
    resultado = normalizar_valor("2500")

    assert resultado == 2500


def test_fingerprint_igual_para_dados_equivalentes():
    descricao1 = normalizar_descricao("Venda Cliente A")
    descricao2 = normalizar_descricao("  VENDA   CLIENTE A  ")

    fingerprint1 = gerar_fingerprint(
        1, "2026-08-24", descricao1, "entrada", "2500"
    )

    fingerprint2 = gerar_fingerprint(
        1, "2026-08-24", descricao2, "entrada", "2500.00"
    )

    assert fingerprint1 == fingerprint2


def test_fingerprint_diferente_para_transacoes_diferentes():
    descricao1 = normalizar_descricao("Venda Cliente A")
    descricao2 = normalizar_descricao("Venda Cliente B")

    fingerprint1 = gerar_fingerprint(
        1, "2026-08-24", descricao1, "entrada", "2500"
    )

    fingerprint2 = gerar_fingerprint(
        1, "2026-08-24", descricao2, "entrada", "2500"
    )

    assert fingerprint1 != fingerprint2
import csv
import random
from calendar import monthrange
from datetime import date, timedelta
from pathlib import Path


random.seed(42)


ARQUIVO_SAIDA = (
    Path(__file__).parent
    / "transacoes_demo.csv"
)


CLIENTES = [
    ("Cliente Atlas", 1.15),
    ("Cliente Horizonte", 0.95),
    ("Cliente Nexus", 1.25),
    ("Cliente Orion", 0.85),
    ("Cliente Aurora", 1.00),
    ("Cliente Prisma", 0.90),
    ("Cliente Vertex", 1.10),
    ("Cliente Solaris", 1.05),
]


SERVICOS = [
    ("Projeto", 2400, 5200),
    ("Consultoria", 1200, 3200),
    ("Serviço mensal", 900, 2200),
    ("Suporte técnico", 450, 1600),
    ("Manutenção", 700, 2100),
    ("Implementação", 1800, 4200),
]


DESPESAS_FIXAS = [
    ("Aluguel", 2800, 5),
    ("Contabilidade", 650, 7),
    ("Internet", 220, 10),
    ("Software e ferramentas", 480, 12),
    ("Energia elétrica", 420, 15),
    ("Folha de pagamento", 6200, 5),
    ("Pró-labore", 2500, 20),
    ("Telefonia", 180, 18),
]


DESPESAS_VARIAVEIS = [
    ("Material de escritório", 80, 420),
    ("Transporte", 40, 260),
    ("Marketing digital", 180, 1100),
    ("Serviço terceirizado", 350, 1800),
    ("Manutenção de equipamento", 120, 900),
    ("Compra de insumos", 150, 1200),
    ("Taxas bancárias", 25, 180),
    ("Hospedagem e infraestrutura", 80, 520),
    ("Frete e entregas", 45, 280),
    ("Treinamento", 120, 650),
]


DESPESAS_EXTRAORDINARIAS = [
    "Compra de equipamento",
    "Reparo emergencial",
    "Licença anual de software",
]


def dia_util_aleatorio(ano, mes):
    ultimo_dia = monthrange(
        ano,
        mes,
    )[1]

    dias_uteis = []

    for dia in range(
        1,
        ultimo_dia + 1,
    ):
        data_atual = date(
            ano,
            mes,
            dia,
        )

        if data_atual.weekday() < 5:
            dias_uteis.append(
                data_atual
            )

    return random.choice(
        dias_uteis
    )


def ajustar_para_dia_util(data_original):
    data_ajustada = data_original

    while (
        data_ajustada.weekday() >= 5
    ):
        data_ajustada += timedelta(
            days=1
        )

    return data_ajustada


def variar_valor(
    valor,
    percentual=0.06,
):
    minimo = 1 - percentual
    maximo = 1 + percentual

    return round(
        valor
        * random.uniform(
            minimo,
            maximo,
        ),
        2,
    )


def adicionar_transacao(
    transacoes,
    data_transacao,
    descricao,
    tipo,
    valor,
):
    transacoes.append({
        "data": (
            data_transacao.isoformat()
        ),
        "descricao": descricao,
        "tipo": tipo,
        "valor": f"{valor:.2f}",
    })


def gerar_entradas(
    transacoes,
    ano,
    mes,
):
    fator_demanda = random.uniform(
        0.85,
        1.15,
    )

    quantidade = random.randint(
        11,
        18,
    )

    for _ in range(quantidade):
        (
            cliente,
            fator_cliente,
        ) = random.choice(
            CLIENTES
        )

        (
            servico,
            valor_minimo,
            valor_maximo,
        ) = random.choice(
            SERVICOS
        )

        valor_base = random.uniform(
            valor_minimo,
            valor_maximo,
        )

        valor = round(
            valor_base
            * fator_cliente
            * fator_demanda,
            2,
        )

        data_transacao = (
            dia_util_aleatorio(
                ano,
                mes,
            )
        )

        descricao = (
            f"{servico} - {cliente}"
        )

        adicionar_transacao(
            transacoes,
            data_transacao,
            descricao,
            "entrada",
            valor,
        )


def gerar_despesas_fixas(
    transacoes,
    ano,
    mes,
):
    for (
        descricao,
        valor_base,
        dia,
    ) in DESPESAS_FIXAS:
        data_transacao = date(
            ano,
            mes,
            dia,
        )

        data_transacao = (
            ajustar_para_dia_util(
                data_transacao
            )
        )

        valor = variar_valor(
            valor_base
        )

        adicionar_transacao(
            transacoes,
            data_transacao,
            descricao,
            "saida",
            valor,
        )


def gerar_despesas_variaveis(
    transacoes,
    ano,
    mes,
):
    quantidade = random.randint(
        16,
        26,
    )

    for _ in range(quantidade):
        (
            descricao,
            valor_minimo,
            valor_maximo,
        ) = random.choice(
            DESPESAS_VARIAVEIS
        )

        valor = round(
            random.uniform(
                valor_minimo,
                valor_maximo,
            ),
            2,
        )

        data_transacao = (
            dia_util_aleatorio(
                ano,
                mes,
            )
        )

        adicionar_transacao(
            transacoes,
            data_transacao,
            descricao,
            "saida",
            valor,
        )


def calcular_faturamento(
    transacoes,
    ano,
    mes,
):
    total = 0.0

    for transacao in transacoes:
        data_transacao = (
            date.fromisoformat(
                transacao["data"]
            )
        )

        if (
            data_transacao.year == ano
            and data_transacao.month
            == mes
            and transacao["tipo"]
            == "entrada"
        ):
            total += float(
                transacao["valor"]
            )

    return total


def gerar_impostos(
    transacoes,
    ano,
    mes,
):
    faturamento = (
        calcular_faturamento(
            transacoes,
            ano,
            mes,
        )
    )

    valor_impostos = round(
        faturamento * 0.06,
        2,
    )

    data_pagamento = (
        ajustar_para_dia_util(
            date(
                ano,
                mes,
                20,
            )
        )
    )

    adicionar_transacao(
        transacoes,
        data_pagamento,
        "Impostos sobre faturamento",
        "saida",
        valor_impostos,
    )


def talvez_gerar_despesa_extra(
    transacoes,
    ano,
    mes,
):
    probabilidade = 0.25

    if (
        random.random()
        >= probabilidade
    ):
        return

    descricao = random.choice(
        DESPESAS_EXTRAORDINARIAS
    )

    valor = round(
        random.uniform(
            2500,
            7000,
        ),
        2,
    )

    data_transacao = (
        dia_util_aleatorio(
            ano,
            mes,
        )
    )

    adicionar_transacao(
        transacoes,
        data_transacao,
        descricao,
        "saida",
        valor,
    )


def gerar_mes(
    transacoes,
    ano,
    mes,
):
    gerar_entradas(
        transacoes,
        ano,
        mes,
    )

    gerar_despesas_fixas(
        transacoes,
        ano,
        mes,
    )

    gerar_despesas_variaveis(
        transacoes,
        ano,
        mes,
    )

    gerar_impostos(
        transacoes,
        ano,
        mes,
    )

    talvez_gerar_despesa_extra(
        transacoes,
        ano,
        mes,
    )


def gerar_dataset():
    transacoes = []

    for mes in [
        6,
        7,
        8,
    ]:
        gerar_mes(
            transacoes,
            2026,
            mes,
        )

    transacoes.sort(
        key=lambda item: (
            item["data"],
            item["descricao"],
            item["valor"],
        )
    )

    return transacoes


def salvar_csv(transacoes):
    with open(
        ARQUIVO_SAIDA,
        "w",
        newline="",
        encoding="utf-8",
    ) as arquivo:
        escritor = csv.DictWriter(
            arquivo,
            fieldnames=[
                "data",
                "descricao",
                "tipo",
                "valor",
            ],
        )

        escritor.writeheader()

        escritor.writerows(
            transacoes
        )


def mostrar_resumo(transacoes):
    resumo = {}

    for transacao in transacoes:
        mes = transacao[
            "data"
        ][:7]

        if mes not in resumo:
            resumo[mes] = {
                "quantidade": 0,
                "entradas": 0.0,
                "saidas": 0.0,
            }

        valor = float(
            transacao["valor"]
        )

        resumo[mes][
            "quantidade"
        ] += 1

        if (
            transacao["tipo"]
            == "entrada"
        ):
            resumo[mes][
                "entradas"
            ] += valor
        else:
            resumo[mes][
                "saidas"
            ] += valor

    print()
    print(
        f"Arquivo criado: "
        f"{ARQUIVO_SAIDA}"
    )

    print(
        f"Total de transações: "
        f"{len(transacoes)}"
    )

    print()

    for mes, dados in resumo.items():
        saldo = (
            dados["entradas"]
            - dados["saidas"]
        )

        print(mes)

        print(
            f"  Transações: "
            f"{dados['quantidade']}"
        )

        print(
            f"  Entradas: "
            f"R$ {dados['entradas']:.2f}"
        )

        print(
            f"  Saídas: "
            f"R$ {dados['saidas']:.2f}"
        )

        print(
            f"  Saldo: "
            f"R$ {saldo:.2f}"
        )

        print()


def main():
    transacoes = (
        gerar_dataset()
    )

    salvar_csv(
        transacoes
    )

    mostrar_resumo(
        transacoes
    )


if __name__ == "__main__":
    main()
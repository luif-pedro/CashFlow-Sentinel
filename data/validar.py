import pandas as pd


COLUNAS_OBRIGATORIAS = [
    "data",
    "descricao",
    "tipo",
    "valor"
]


def validar_colunas(df):
    colunas = list(df.columns)

    faltando = [
        coluna
        for coluna in COLUNAS_OBRIGATORIAS
        if coluna not in colunas
    ]

    if faltando:
        raise ValueError(
            f"Colunas obrigatórias ausentes: {', '.join(faltando)}"
        )


def validar_dados(df):
    validar_colunas(df)

    if df.empty:
        raise ValueError("O arquivo CSV está vazio.")

    if df["descricao"].isnull().any():
        raise ValueError("Existem transações sem descrição.")

    if df["tipo"].isnull().any():
        raise ValueError("Existem transações sem tipo.")

    tipos_validos = {"entrada", "saida"}

    tipos_encontrados = set(
    df["tipo"].dropna().astype(str).str.strip().str.lower()
)
    tipos_invalidos = tipos_encontrados - tipos_validos

    if tipos_invalidos:
        raise ValueError(
            f"Tipo de transação inválido: {', '.join(tipos_invalidos)}"
        )

    datas_invalidas = pd.to_datetime(
        df["data"],
        errors="coerce"
    ).isnull()

    if datas_invalidas.any():
        raise ValueError("Existem datas inválidas no arquivo.")

    valores_invalidos = pd.to_numeric(
        df["valor"],
        errors="coerce"
    ).isnull()

    if valores_invalidos.any():
        raise ValueError("Existem valores inválidos no arquivo.")

    return True

if __name__ == "__main__":
    df = pd.read_csv("transacoes.csv")
    validar_dados(df)
    print("Validação concluída com sucesso!")
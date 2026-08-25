import pandas as pd

df = pd.read_csv("transacoes.csv")

colunas_esperadas = ["data", "descricao", "tipo", "valor"]

if list(df.columns) == colunas_esperadas:
    print("Colunas corretas!")
else:
    print("ERRO: colunas do CSV estão incorretas.")

tipos_validos = ["entrada", "saida"]

if df["tipo"].isin(tipos_validos).all():
    print("Tipos de transacao corretos!")
else:
    print("ERRO: existe um tipo de transacao invalido.")

if pd.api.types.is_numeric_dtype(df["valor"]) and (df["valor"] > 0).all():
    print("Valores corretos!")
else:
    print("ERRO: existe um valor invalido.")

print(df)

print("\nTotal de transacoes:", len(df))
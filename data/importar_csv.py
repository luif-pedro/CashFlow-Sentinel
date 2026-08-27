from importador import importar_transacoes


with open("transacoes.csv", "r", encoding="utf-8") as arquivo:
    resultado = importar_transacoes(arquivo, empresa_id=1)


print(f"Transacoes encontradas: {resultado['encontradas']}")
print(f"Transacoes importadas: {resultado['importadas']}")
print(f"Transacoes duplicadas: {resultado['duplicadas']}")
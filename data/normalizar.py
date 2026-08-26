import re
import hashlib
from decimal import Decimal


def normalizar_descricao(descricao):
    descricao = str(descricao)
    descricao = descricao.strip()
    descricao = re.sub(r"\s+", " ", descricao)
    descricao = descricao.lower()

    return descricao


def normalizar_valor(valor):
    return Decimal(str(valor)).quantize(Decimal("0.01"))


def gerar_fingerprint(empresa_id, data, descricao, tipo, valor):
    valor_normalizado = normalizar_valor(valor)

    dados = f"{empresa_id}|{data}|{descricao}|{tipo}|{valor_normalizado}"

    return hashlib.sha256(dados.encode("utf-8")).hexdigest()
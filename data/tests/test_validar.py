import pandas as pd
import pytest

from data.validar import validar_dados


def test_validar_csv_valido():
    df = pd.DataFrame({
        "data": ["2026-08-25"],
        "descricao": ["Venda Cliente A"],
        "tipo": ["entrada"],
        "valor": [2500]
    })

    assert validar_dados(df) is True


def test_rejeita_tipo_invalido():
    df = pd.DataFrame({
        "data": ["2026-08-25"],
        "descricao": ["Teste"],
        "tipo": ["invalido"],
        "valor": [100]
    })

    with pytest.raises(ValueError):
        validar_dados(df)


def test_rejeita_data_invalida():
    df = pd.DataFrame({
        "data": ["data-invalida"],
        "descricao": ["Teste"],
        "tipo": ["entrada"],
        "valor": [100]
    })

    with pytest.raises(ValueError):
        validar_dados(df)


def test_rejeita_valor_invalido():
    df = pd.DataFrame({
        "data": ["2026-08-25"],
        "descricao": ["Teste"],
        "tipo": ["entrada"],
        "valor": ["abc"]
    })

    with pytest.raises(ValueError):
        validar_dados(df)


def test_rejeita_coluna_obrigatoria_ausente():
    df = pd.DataFrame({
        "data": ["2026-08-25"],
        "descricao": ["Teste"],
        "valor": [100]
    })

    with pytest.raises(ValueError):
        validar_dados(df)


def test_rejeita_dataframe_vazio():
    df = pd.DataFrame(
        columns=["data", "descricao", "tipo", "valor"]
    )

    with pytest.raises(ValueError):
        validar_dados(df)
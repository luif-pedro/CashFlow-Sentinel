from datetime import date

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    HTTPException,
    Query,
)
from fastapi.middleware.cors import CORSMiddleware

from backend.database import conectar
from backend.services import (
    calcular_fluxo_caixa,
    fluxo_caixa_diario,
)
from backend.alertas import verificar_alertas
from data.importador import importar_transacoes


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def inicio():
    return {
        "mensagem": "CashFlow API funcionando!"
    }


@app.get("/transacoes")
def listar_transacoes(
    pagina: int = Query(
        default=1,
        ge=1
    ),
    limite: int = Query(
        default=50,
        ge=1,
        le=100
    ),
    data_inicio: date | None = None,
    data_fim: date | None = None
):
    if (
        data_inicio is not None
        and data_fim is not None
        and data_inicio > data_fim
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "A data inicial não pode ser "
                "posterior à data final."
            )
        )

    conn = conectar()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT COUNT(*)
            FROM transacoes
            WHERE empresa_id = %s
              AND (%s IS NULL OR data >= %s)
              AND (%s IS NULL OR data <= %s)
            """,
            (
                1,
                data_inicio,
                data_inicio,
                data_fim,
                data_fim,
            )
        )

        total = cursor.fetchone()[0]

        offset = (
            pagina - 1
        ) * limite


        cursor.execute(
            """
            SELECT
                id,
                data,
                descricao,
                tipo,
                valor
            FROM transacoes
            WHERE empresa_id = %s
              AND (%s IS NULL OR data >= %s)
              AND (%s IS NULL OR data <= %s)
            ORDER BY data DESC, id DESC
            LIMIT %s
            OFFSET %s
            """,
            (
                1,
                data_inicio,
                data_inicio,
                data_fim,
                data_fim,
                limite,
                offset,
            )
        )

        resultados = cursor.fetchall()

        transacoes = []

        for linha in resultados:
            transacao = {
                "id": linha[0],
                "data": linha[1],
                "descricao": linha[2],
                "tipo": linha[3],
                "valor": float(linha[4])
            }

            transacoes.append(
                transacao
            )


        if total == 0:
            total_paginas = 0
        else:
            total_paginas = (
                total + limite - 1
            ) // limite


        return {
            "transacoes": transacoes,
            "total": total,
            "pagina": pagina,
            "limite": limite,
            "total_paginas": total_paginas
        }

    finally:
        cursor.close()
        conn.close()


@app.post("/importar")
def importar_csv(
    arquivo: UploadFile = File(...)
):
    try:
        resultado = importar_transacoes(
            arquivo.file,
            empresa_id=1
        )

        return resultado

    except ValueError as erro:
        raise HTTPException(
            status_code=400,
            detail=str(erro)
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail=(
                "Erro interno ao importar "
                "transações."
            )
        )


@app.get("/fluxo-caixa")
def fluxo_caixa(
    data_inicio: date,
    data_fim: date
):
    if data_inicio > data_fim:
        raise HTTPException(
            status_code=400,
            detail=(
                "A data inicial não pode ser "
                "posterior à data final."
            )
        )

    resultado = calcular_fluxo_caixa(
        empresa_id=1,
        data_inicio=data_inicio,
        data_fim=data_fim
    )

    diario = fluxo_caixa_diario(
        empresa_id=1,
        data_inicio=data_inicio,
        data_fim=data_fim
    )

    alertas = verificar_alertas(
        resultado,
        diario
    )

    return {
        "entradas": float(
            resultado["entradas"]
        ),
        "saidas": float(
            resultado["saidas"]
        ),
        "saldo": float(
            resultado["saldo"]
        ),
        "cobertura": (
            float(
                resultado["cobertura"]
            )
            if resultado["cobertura"]
            is not None
            else None
        ),
        "alertas": alertas,
        "diario": [
            {
                "data": (
                    item["data"]
                    .isoformat()
                ),
                "entradas": float(
                    item["entradas"]
                ),
                "saidas": float(
                    item["saidas"]
                ),
                "saldo": float(
                    item["saldo"]
                ),
                "saldo_acumulado": float(
                    item[
                        "saldo_acumulado"
                    ]
                )
            }
            for item in diario
        ]
    }
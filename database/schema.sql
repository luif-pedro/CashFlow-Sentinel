CREATE TABLE empresas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

CREATE TABLE transacoes (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER NOT NULL,
    data DATE NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    tipo VARCHAR(10) NOT NULL,
    valor NUMERIC(12,2) NOT NULL,
    fingerprint VARCHAR(64),

    CONSTRAINT fk_transacoes_empresa
        FOREIGN KEY (empresa_id)
        REFERENCES empresas(id),

    CONSTRAINT transacao_unica
        UNIQUE (empresa_id, fingerprint)
);
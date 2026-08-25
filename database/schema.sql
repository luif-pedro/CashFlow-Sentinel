CREATE TABLE transacoes (
    id SERIAL PRIMARY KEY,
    data DATE NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    tipo VARCHAR(10) NOT NULL,
    valor NUMERIC(12,2) NOT NULL,
    CONSTRAINT transacao_unica UNIQUE (data, descricao, tipo, valor)
);
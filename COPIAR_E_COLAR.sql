CREATE TABLE IF NOT EXISTS frequencias (
  id BIGSERIAL PRIMARY KEY,
  usuario VARCHAR(255) NOT NULL,
  data DATE NOT NULL,
  horas DECIMAL(10, 2) NOT NULL,
  atividade VARCHAR(255) NOT NULL,
  observacao TEXT,
  ano INTEGER NOT NULL,
  mes INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_frequencias_usuario ON frequencias(usuario);
CREATE INDEX IF NOT EXISTS idx_frequencias_periodo ON frequencias(ano, mes);
CREATE INDEX IF NOT EXISTS idx_frequencias_usuario_periodo ON frequencias(usuario, ano, mes);
CREATE INDEX IF NOT EXISTS idx_frequencias_data ON frequencias(data);

CREATE TABLE IF NOT EXISTS gastos (
  id BIGSERIAL PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  categorias VARCHAR(100) NOT NULL,
  pessoa VARCHAR(100) NOT NULL,
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  data_criacao TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gastos_periodo ON gastos(ano, mes);
CREATE INDEX IF NOT EXISTS idx_gastos_pessoa ON gastos(pessoa);
CREATE INDEX IF NOT EXISTS idx_gastos_categoria ON gastos(categorias);

CREATE TABLE IF NOT EXISTS usuarios (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO usuarios (nome, email) VALUES 
  ('Daniel', 'daniel@exemplo.com'),
  ('douglas', 'douglas@exemplo.com'),
  ('Convidado 1', 'convidado1@exemplo.com')
ON CONFLICT (nome) DO NOTHING;

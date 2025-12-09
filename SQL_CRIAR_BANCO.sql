-- =====================================================================
-- SCRIPT SQL PARA SUPABASE - FREQUÊNCIA + FATURA
-- =====================================================================
-- Este script cria as tabelas com suporte a múltiplos usuários
-- Cada usuário tem seus próprios registros isolados
-- =====================================================================

-- =====================================================================
-- 1. TABELA: frequencias
-- =====================================================================
-- Armazena registros de frequência por usuário
-- Período: 20 do mês anterior a 19 do mês atual

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

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_frequencias_usuario ON frequencias(usuario);
CREATE INDEX IF NOT EXISTS idx_frequencias_periodo ON frequencias(ano, mes);
CREATE INDEX IF NOT EXISTS idx_frequencias_usuario_periodo ON frequencias(usuario, ano, mes);
CREATE INDEX IF NOT EXISTS idx_frequencias_data ON frequencias(data);

-- =====================================================================
-- 2. TABELA: gastos
-- =====================================================================
-- Armazena gastos do cartão compartilhado
-- Não é isolado por usuário (é compartilhado)

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

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_gastos_periodo ON gastos(ano, mes);
CREATE INDEX IF NOT EXISTS idx_gastos_pessoa ON gastos(pessoa);
CREATE INDEX IF NOT EXISTS idx_gastos_categoria ON gastos(categorias);

-- =====================================================================
-- 3. TABELA: usuarios (OPCIONAL - para controle)
-- =====================================================================
-- Armazena informações dos usuários do sistema

CREATE TABLE IF NOT EXISTS usuarios (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert dos usuários principais
INSERT INTO usuarios (nome, email) VALUES 
  ('Daniel', 'daniel@exemplo.com'),
  ('douglas', 'douglas@exemplo.com'),
  ('Convidado 1', 'convidado1@exemplo.com')
ON CONFLICT (nome) DO NOTHING;

-- =====================================================================
-- 4. POLICIES (Row Level Security) - IMPORTANTE PARA PRODUÇÃO
-- =====================================================================
-- Descomente estas linhas DEPOIS de testar, para ativar segurança

-- ALTER TABLE frequencias ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;

-- -- Frequências: Usuários veem e editam apenas suas frequências
-- CREATE POLICY "Usuários veem suas frequências"
-- ON frequencias FOR SELECT
-- USING (usuario = current_user_id()::text);

-- CREATE POLICY "Usuários inserem suas frequências"
-- ON frequencias FOR INSERT
-- WITH CHECK (usuario = current_user_id()::text);

-- CREATE POLICY "Usuários editam suas frequências"
-- ON frequencias FOR UPDATE
-- USING (usuario = current_user_id()::text);

-- CREATE POLICY "Usuários deletam suas frequências"
-- ON frequencias FOR DELETE
-- USING (usuario = current_user_id()::text);

-- -- Gastos: Qualquer um pode ver, inserir e deletar (compartilhado)
-- CREATE POLICY "Qualquer um pode ler gastos"
-- ON gastos FOR SELECT
-- USING (true);

-- CREATE POLICY "Qualquer um pode inserir gastos"
-- ON gastos FOR INSERT
-- WITH CHECK (true);

-- CREATE POLICY "Qualquer um pode deletar gastos"
-- ON gastos FOR DELETE
-- USING (true);

-- =====================================================================
-- 5. FUNÇÕES ÚTEIS (OPTIONAL)
-- =====================================================================

-- Função para obter total de horas por usuário/período
CREATE OR REPLACE FUNCTION get_total_horas(
  p_usuario VARCHAR,
  p_ano INTEGER,
  p_mes INTEGER
) RETURNS DECIMAL AS $$
  SELECT COALESCE(SUM(horas), 0)
  FROM frequencias
  WHERE usuario = p_usuario
  AND ano = p_ano
  AND mes = p_mes;
$$ LANGUAGE SQL;

-- Função para obter total de gastos
CREATE OR REPLACE FUNCTION get_total_gastos(
  p_ano INTEGER,
  p_mes INTEGER
) RETURNS DECIMAL AS $$
  SELECT COALESCE(SUM(valor), 0)
  FROM gastos
  WHERE ano = p_ano
  AND mes = p_mes;
$$ LANGUAGE SQL;

-- Função para obter gastos por pessoa
CREATE OR REPLACE FUNCTION get_gastos_por_pessoa(
  p_ano INTEGER,
  p_mes INTEGER
) RETURNS TABLE (pessoa VARCHAR, total DECIMAL) AS $$
  SELECT pessoa, SUM(valor) as total
  FROM gastos
  WHERE ano = p_ano
  AND mes = p_mes
  GROUP BY pessoa
  ORDER BY total DESC;
$$ LANGUAGE SQL;

-- =====================================================================
-- VERIFICAÇÃO: Mostrar as tabelas criadas
-- =====================================================================

-- Descomente abaixo para verificar (execute cada SELECT separadamente)

-- SELECT COUNT(*) as total_frequencias FROM frequencias;
-- SELECT COUNT(*) as total_gastos FROM gastos;
-- SELECT * FROM usuarios;

-- =====================================================================
-- FIM DO SCRIPT
-- =====================================================================

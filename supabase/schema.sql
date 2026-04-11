-- ============================================
-- SOS Guararapes — Schema do Supabase
-- Cole esse SQL no editor do Supabase (SQL Editor)
-- ============================================

-- CIDADES
CREATE TABLE cidades (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- CATEGORIAS
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  icone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- PRESTADORES
CREATE TABLE prestadores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  descricao TEXT,
  cidade_id INTEGER REFERENCES cidades(id) ON DELETE CASCADE,
  categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
  premium BOOLEAN DEFAULT false,
  visualizacoes INTEGER DEFAULT 0,
  cliques_whatsapp INTEGER DEFAULT 0,
  avaliacao_media DECIMAL(3,2) DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- LOGS DE LEADS (cliques WhatsApp)
CREATE TABLE logs_leads (
  id SERIAL PRIMARY KEY,
  prestador_id INTEGER REFERENCES prestadores(id) ON DELETE CASCADE,
  cidade_id INTEGER REFERENCES cidades(id) ON DELETE SET NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- DADOS INICIAIS (seed)
-- ============================================

INSERT INTO cidades (nome, estado, ativo) VALUES
  ('Guararapes', 'SP', true),
  ('Araçatuba', 'SP', true),
  ('Birigui', 'SP', true);

INSERT INTO categorias (nome, icone) VALUES
  ('Eletricista', 'bolt'),
  ('Encanador', 'water-drop'),
  ('Pedreiro', 'construction'),
  ('Pintor', 'format-paint'),
  ('Diarista', 'cleaning-services'),
  ('Mecânico', 'car-repair'),
  ('Chaveiro', 'vpn-key'),
  ('Jardineiro', 'yard'),
  ('Desentupidora', 'plumbing'),
  ('Assistência Técnica', 'build');

INSERT INTO prestadores (nome, telefone, descricao, cidade_id, categoria_id, premium) VALUES
  ('João Elétrica', '18999990001', 'Eletricista residencial e industrial com 10 anos de experiência.', 1, 1, true),
  ('Pedro Encanamentos', '18999990002', 'Consertos rápidos, instalações e desentupimentos.', 1, 2, false),
  ('Carlos Reformas', '18999990003', 'Pequenas e grandes reformas, orçamento grátis.', 1, 3, true);

-- ============================================
-- FUNÇÃO: incrementar clique no WhatsApp
-- ============================================
CREATE OR REPLACE FUNCTION registrar_lead(p_prestador_id INT, p_cidade_id INT)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO logs_leads (prestador_id, cidade_id) VALUES (p_prestador_id, p_cidade_id);
  UPDATE prestadores SET cliques_whatsapp = cliques_whatsapp + 1 WHERE id = p_prestador_id;
END;
$$;

-- ============================================
-- ROW LEVEL SECURITY (leitura pública)
-- ============================================
ALTER TABLE cidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura publica cidades" ON cidades FOR SELECT USING (true);
CREATE POLICY "Leitura publica categorias" ON categorias FOR SELECT USING (true);
CREATE POLICY "Leitura publica prestadores" ON prestadores FOR SELECT USING (ativo = true);
CREATE POLICY "Insert publico leads" ON logs_leads FOR INSERT WITH CHECK (true);

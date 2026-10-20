CREATE TABLE IF NOT EXISTS pets (
  id SERIAL PRIMARY KEY,
  ong_id INTEGER NOT NULL REFERENCES ongs(id),
  nome VARCHAR(100) NOT NULL,
  especie VARCHAR(10) NOT NULL CHECK (especie IN ('gato', 'cachorro')),
  porte VARCHAR(10) NOT NULL CHECK (porte IN ('pequeno', 'medio', 'grande')),
  idade_anos SMALLINT NOT NULL CHECK (idade_anos BETWEEN 0 AND 40),
  raca VARCHAR(100),
  descricao TEXT,
  vacinado BOOLEAN NOT NULL DEFAULT FALSE,
  castrado BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(12) NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'adotado')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pets_ong_id ON pets(ong_id);
CREATE INDEX IF NOT EXISTS idx_pets_status ON pets(status);

-- Fotos ficam no próprio Postgres (até 2 por pet): evita volume extra no Docker e a foto
-- é apagada junto com o pet.
CREATE TABLE IF NOT EXISTS pet_fotos (
  id SERIAL PRIMARY KEY,
  pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  posicao SMALLINT NOT NULL CHECK (posicao IN (0, 1)),
  mime_type VARCHAR(30) NOT NULL,
  dados BYTEA NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (pet_id, posicao)
);

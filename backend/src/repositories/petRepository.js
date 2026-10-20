const { pool } = require('../config/database');

// fotos_ids vem agregado em uma única query para não fazer N+1 na listagem.
const SELECT_PET = `
  SELECT p.id, p.ong_id, p.nome, p.especie, p.porte, p.idade_anos, p.raca, p.descricao,
         p.vacinado, p.castrado, p.status, p.created_at, p.updated_at,
         o.nome AS ong_nome, o.cidade, o.estado,
         COALESCE(
           (SELECT json_agg(f.id ORDER BY f.posicao) FROM pet_fotos f WHERE f.pet_id = p.id),
           '[]'::json
         ) AS fotos_ids
  FROM pets p
  JOIN ongs o ON o.id = p.ong_id
`;

async function criar(
  { ong_id, nome, especie, porte, idade_anos, raca, descricao, vacinado, castrado },
  client = pool
) {
  const { rows } = await client.query(
    `INSERT INTO pets (ong_id, nome, especie, porte, idade_anos, raca, descricao, vacinado, castrado)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id`,
    [ong_id, nome, especie, porte, idade_anos, raca, descricao, vacinado, castrado]
  );
  return rows[0];
}

async function atualizar(
  id,
  { nome, especie, porte, idade_anos, raca, descricao, vacinado, castrado },
  client = pool
) {
  await client.query(
    `UPDATE pets
     SET nome = $2, especie = $3, porte = $4, idade_anos = $5, raca = $6, descricao = $7,
         vacinado = $8, castrado = $9, updated_at = NOW()
     WHERE id = $1`,
    [id, nome, especie, porte, idade_anos, raca, descricao, vacinado, castrado]
  );
}

async function atualizarStatus(id, status) {
  await pool.query('UPDATE pets SET status = $2, updated_at = NOW() WHERE id = $1', [id, status]);
}

async function excluir(id) {
  await pool.query('DELETE FROM pets WHERE id = $1', [id]);
}

async function buscarPorId(id) {
  const { rows } = await pool.query(`${SELECT_PET} WHERE p.id = $1`, [id]);
  return rows[0];
}

async function listar({ ongId, status } = {}) {
  const condicoes = [];
  const valores = [];

  if (ongId) {
    valores.push(ongId);
    condicoes.push(`p.ong_id = $${valores.length}`);
  }
  if (status) {
    valores.push(status);
    condicoes.push(`p.status = $${valores.length}`);
  }

  const where = condicoes.length ? `WHERE ${condicoes.join(' AND ')}` : '';
  const { rows } = await pool.query(`${SELECT_PET} ${where} ORDER BY p.created_at DESC, p.id DESC`, valores);
  return rows;
}

module.exports = { criar, atualizar, atualizarStatus, excluir, buscarPorId, listar };

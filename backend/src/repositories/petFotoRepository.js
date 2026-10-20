const { pool } = require('../config/database');

async function inserir({ pet_id, posicao, mime_type, dados }, client = pool) {
  await client.query(
    'INSERT INTO pet_fotos (pet_id, posicao, mime_type, dados) VALUES ($1, $2, $3, $4)',
    [pet_id, posicao, mime_type, dados]
  );
}

// Só metadados — não traz o BYTEA, que pode ser pesado.
async function listarPorPet(pet_id, client = pool) {
  const { rows } = await client.query(
    'SELECT id, posicao FROM pet_fotos WHERE pet_id = $1 ORDER BY posicao',
    [pet_id]
  );
  return rows;
}

async function buscarPorId(id, pet_id) {
  const { rows } = await pool.query(
    'SELECT id, mime_type, dados FROM pet_fotos WHERE id = $1 AND pet_id = $2',
    [id, pet_id]
  );
  return rows[0];
}

async function removerPorIds(ids, pet_id, client = pool) {
  if (ids.length === 0) return;
  await client.query('DELETE FROM pet_fotos WHERE pet_id = $1 AND id = ANY($2::int[])', [pet_id, ids]);
}

module.exports = { inserir, listarPorPet, buscarPorId, removerPorIds };

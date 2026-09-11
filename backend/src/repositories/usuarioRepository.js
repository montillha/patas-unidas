const { pool } = require('../config/database');

async function criar({ conta_id, nome, telefone, cidade, estado }, client = pool) {
  const query = `
    INSERT INTO usuarios (conta_id, nome, telefone, cidade, estado)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, conta_id, nome, telefone, cidade, estado, created_at
  `;
  const valores = [conta_id, nome, telefone, cidade, estado];
  const { rows } = await client.query(query, valores);
  return rows[0];
}

async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT u.id, u.conta_id, u.nome, c.email, u.telefone, u.cidade, u.estado, u.created_at
     FROM usuarios u
     JOIN contas c ON c.id = u.conta_id
     WHERE u.id = $1`,
    [id]
  );
  return rows[0];
}

async function buscarPorContaId(conta_id) {
  const { rows } = await pool.query(
    `SELECT u.id, u.conta_id, u.nome, c.email, u.telefone, u.cidade, u.estado, u.created_at
     FROM usuarios u
     JOIN contas c ON c.id = u.conta_id
     WHERE u.conta_id = $1`,
    [conta_id]
  );
  return rows[0];
}

module.exports = { criar, buscarPorId, buscarPorContaId };

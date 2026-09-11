const { pool } = require('../config/database');

async function criar({ email, senha_hash, tipo }, client = pool) {
  const query = `
    INSERT INTO contas (email, senha_hash, tipo)
    VALUES ($1, $2, $3)
    RETURNING id, email, tipo, created_at
  `;
  const { rows } = await client.query(query, [email, senha_hash, tipo]);
  return rows[0];
}

async function buscarPorEmail(email) {
  const { rows } = await pool.query('SELECT * FROM contas WHERE email = $1', [email]);
  return rows[0];
}

async function buscarPorId(id) {
  const { rows } = await pool.query(
    'SELECT id, email, tipo, created_at FROM contas WHERE id = $1',
    [id]
  );
  return rows[0];
}

module.exports = { criar, buscarPorEmail, buscarPorId };

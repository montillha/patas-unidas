const { pool } = require('../config/database');

async function criar({ conta_id, nome, telefone, endereco, cidade, estado, descricao }, client = pool) {
  const query = `
    INSERT INTO ongs (conta_id, nome, telefone, endereco, cidade, estado, descricao)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, conta_id, nome, telefone, endereco, cidade, estado, descricao, created_at
  `;
  const valores = [conta_id, nome, telefone, endereco, cidade, estado, descricao];
  const { rows } = await client.query(query, valores);
  return rows[0];
}

async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT o.id, o.conta_id, o.nome, c.email, o.telefone, o.endereco, o.cidade, o.estado, o.descricao, o.created_at
     FROM ongs o
     JOIN contas c ON c.id = o.conta_id
     WHERE o.id = $1`,
    [id]
  );
  return rows[0];
}

async function buscarPorContaId(conta_id) {
  const { rows } = await pool.query(
    `SELECT o.id, o.conta_id, o.nome, c.email, o.telefone, o.endereco, o.cidade, o.estado, o.descricao, o.created_at
     FROM ongs o
     JOIN contas c ON c.id = o.conta_id
     WHERE o.conta_id = $1`,
    [conta_id]
  );
  return rows[0];
}

async function listar() {
  const { rows } = await pool.query(
    `SELECT o.id, o.conta_id, o.nome, c.email, o.telefone, o.endereco, o.cidade, o.estado, o.descricao, o.created_at
     FROM ongs o
     JOIN contas c ON c.id = o.conta_id
     ORDER BY o.nome`
  );
  return rows;
}

async function atualizar(id, { nome, telefone, endereco, cidade, estado, descricao }) {
  await pool.query(
    `UPDATE ongs
     SET nome = $1, telefone = $2, endereco = $3, cidade = $4, estado = $5, descricao = $6
     WHERE id = $7`,
    [nome, telefone, endereco, cidade, estado, descricao, id]
  );
}

module.exports = { criar, buscarPorId, buscarPorContaId, listar, atualizar };

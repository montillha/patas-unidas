// Script simples de migração: roda todos os .sql da pasta migrations, em ordem.
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      arquivo VARCHAR(255) PRIMARY KEY,
      aplicado_em TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  const dir = path.join(__dirname, 'migrations');
  const arquivos = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  const { rows } = await pool.query('SELECT arquivo FROM schema_migrations');
  const aplicados = new Set(rows.map((r) => r.arquivo));

  for (const arquivo of arquivos) {
    if (aplicados.has(arquivo)) {
      console.log(`Ignorando (já aplicada): ${arquivo}`);
      continue;
    }
    const sql = fs.readFileSync(path.join(dir, arquivo), 'utf-8');
    console.log(`Executando migração: ${arquivo}`);
    await pool.query(sql);
    await pool.query('INSERT INTO schema_migrations (arquivo) VALUES ($1)', [arquivo]);
  }

  console.log('Migrações concluídas.');
  await pool.end();
}

migrate().catch((err) => {
  console.error('Erro ao migrar:', err);
  process.exit(1);
});

// Representa o formato da entidade Usuario (tutor/adotante). Como não usamos ORM, este arquivo
// documenta o shape esperado e serve de referência única para repositories/services/controllers.

/**
 * @typedef {Object} Usuario
 * @property {number} id
 * @property {number} conta_id
 * @property {string} nome
 * @property {string} [email] - vem do JOIN com contas, não é coluna própria
 * @property {string} [telefone]
 * @property {string} cidade
 * @property {string} estado - sigla com 2 letras
 * @property {string} created_at
 */

module.exports = {};

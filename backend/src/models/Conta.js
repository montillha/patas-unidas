// Representa o formato da entidade Conta. Como não usamos ORM, este arquivo documenta o
// shape esperado e serve de referência única para repositories/services/controllers.

/**
 * @typedef {Object} Conta
 * @property {number} id
 * @property {string} email
 * @property {string} senha_hash
 * @property {'ong'|'usuario'} tipo
 * @property {string} created_at
 */

module.exports = {};

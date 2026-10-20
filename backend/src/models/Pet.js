// Representa o formato da entidade Pet. Como não usamos ORM, este arquivo documenta o
// shape esperado e serve de referência única para repositories/services/controllers.

const ESPECIES = ['gato', 'cachorro'];
const PORTES = ['pequeno', 'medio', 'grande'];
const STATUS = ['disponivel', 'adotado'];
const MAX_FOTOS = 2;

/**
 * @typedef {Object} Pet
 * @property {number} id
 * @property {number} ong_id
 * @property {string} nome
 * @property {'gato'|'cachorro'} especie
 * @property {'pequeno'|'medio'|'grande'} porte
 * @property {number} idade_anos
 * @property {string} [raca]
 * @property {string} [descricao]
 * @property {boolean} vacinado
 * @property {boolean} castrado
 * @property {'disponivel'|'adotado'} status
 * @property {string} [ong_nome] - vem do JOIN com ongs, não é coluna própria
 * @property {string} [cidade] - vem do JOIN com ongs
 * @property {string} [estado] - vem do JOIN com ongs
 * @property {{id: number, url: string}[]} fotos - até MAX_FOTOS, montado no service
 * @property {string} created_at
 * @property {string} updated_at
 */

module.exports = { ESPECIES, PORTES, STATUS, MAX_FOTOS };

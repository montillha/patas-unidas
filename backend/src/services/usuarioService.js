const { validarEmail, validarSenha } = require('../utils/validadores');
const { ErroDeValidacao } = require('../utils/errors');

function validarCampos(dados) {
  const { nome, email, senha, cidade, estado } = dados;

  if (!nome || nome.trim().length < 3) {
    throw new ErroDeValidacao('Nome deve ter ao menos 3 caracteres.');
  }
  validarEmail(email);
  validarSenha(senha);
  if (!cidade || !cidade.trim()) throw new ErroDeValidacao('Cidade é obrigatória.');
  if (!estado || estado.trim().length !== 2) {
    throw new ErroDeValidacao('Estado deve ser a sigla com 2 letras.');
  }
}

module.exports = { validarCampos };

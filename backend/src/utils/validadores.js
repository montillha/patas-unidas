const { ErroDeValidacao } = require('./errors');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarEmail(email) {
  if (!email || !EMAIL_REGEX.test(email)) {
    throw new ErroDeValidacao('E-mail inválido.');
  }
}

function validarSenha(senha) {
  if (!senha || senha.length < 6) {
    throw new ErroDeValidacao('Senha deve ter ao menos 6 caracteres.');
  }
}

module.exports = { validarEmail, validarSenha };

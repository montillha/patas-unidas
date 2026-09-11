class ErroDeValidacao extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'ErroDeValidacao';
    this.status = 400;
  }
}

class ErroDeAutenticacao extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'ErroDeAutenticacao';
    this.status = 401;
  }
}

class ErroDeAutorizacao extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'ErroDeAutorizacao';
    this.status = 403;
  }
}

class ErroDeConflito extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'ErroDeConflito';
    this.status = 409;
  }
}

module.exports = { ErroDeValidacao, ErroDeAutenticacao, ErroDeAutorizacao, ErroDeConflito };

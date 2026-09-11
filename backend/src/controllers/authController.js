const authService = require('../services/authService');

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function opcoesCookie() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE_MS,
  };
}

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    const { token, conta, perfil } = await authService.login(email, senha);
    res.cookie('token', token, opcoesCookie());
    res.json({ conta, perfil });
  } catch (err) {
    next(err);
  }
}

function logout(req, res) {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.status(204).end();
}

async function me(req, res, next) {
  try {
    const perfil = await authService.buscarPerfilAtual(req.conta.contaId, req.conta.tipo);
    res.json({ conta: { id: req.conta.contaId, tipo: req.conta.tipo }, perfil });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, logout, me };

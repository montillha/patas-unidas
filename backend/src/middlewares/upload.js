const multer = require('multer');
const { ErroDeValidacao } = require('../utils/errors');
const { MAX_FOTOS } = require('../models/Pet');

const TAMANHO_MAXIMO_BYTES = 2 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: TAMANHO_MAXIMO_BYTES, files: MAX_FOTOS },
}).array('fotos', MAX_FOTOS);

const MENSAGENS = {
  LIMIT_FILE_SIZE: 'Cada foto deve ter no máximo 2 MB.',
  LIMIT_FILE_COUNT: `Envie no máximo ${MAX_FOTOS} fotos.`,
  LIMIT_UNEXPECTED_FILE: `Envie no máximo ${MAX_FOTOS} fotos.`,
};

// Converte os erros do multer em ErroDeValidacao (400) para o errorHandler responder
// com uma mensagem útil em vez de 500.
function uploadFotos(req, res, next) {
  upload(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      return next(new ErroDeValidacao(MENSAGENS[err.code] || 'Não foi possível processar as fotos.'));
    }
    return next(err);
  });
}

module.exports = { uploadFotos };

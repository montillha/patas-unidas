const router = require('express').Router();
const localizacaoController = require('../controllers/localizacaoController');

router.get('/', localizacaoController.listarEstados);

module.exports = router;

const router = require('express').Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/', usuarioController.criar);

module.exports = router;

const router = require('express').Router();
const ongController = require('../controllers/ongController');
const { autenticar, autorizarTipo } = require('../middlewares/auth');

router.post('/', ongController.criar);
router.get('/', ongController.listar);
router.get('/:id', ongController.buscarPorId);
router.put('/:id', autenticar, autorizarTipo('ong'), ongController.atualizar);

module.exports = router;

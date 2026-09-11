const router = require('express').Router();
const ongController = require('../controllers/ongController');

router.post('/', ongController.criar);
router.get('/', ongController.listar);
router.get('/:id', ongController.buscarPorId);

module.exports = router;

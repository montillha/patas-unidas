const router = require('express').Router();
const petController = require('../controllers/petController');
const { autenticar, autorizarTipo } = require('../middlewares/auth');
const { uploadFotos } = require('../middlewares/upload');

const somenteOng = [autenticar, autorizarTipo('ong')];

router.get('/', petController.listar);
router.post('/', ...somenteOng, uploadFotos, petController.criar);
router.get('/:id/fotos/:fotoId', petController.foto);
router.get('/:id', petController.buscarPorId);
router.put('/:id', ...somenteOng, uploadFotos, petController.atualizar);
router.patch('/:id/status', ...somenteOng, petController.alterarStatus);
router.delete('/:id', ...somenteOng, petController.excluir);

module.exports = router;

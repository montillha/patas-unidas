const router = require('express').Router();
const ongRoutes = require('./ongRoutes');
const usuarioRoutes = require('./usuarioRoutes');
const authRoutes = require('./authRoutes');
const localizacaoRoutes = require('./localizacaoRoutes');

router.use('/ongs', ongRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/auth', authRoutes);
router.use('/estados', localizacaoRoutes);

module.exports = router;

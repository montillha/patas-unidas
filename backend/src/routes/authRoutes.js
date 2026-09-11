const router = require('express').Router();
const authController = require('../controllers/authController');
const { autenticar } = require('../middlewares/auth');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', autenticar, authController.me);

module.exports = router;

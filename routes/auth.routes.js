const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT } = require('../middlewares/index.js');
const { login, googleSignIn, renovarToken } = require('../controllers/auth.controller');

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),  
    validarCampos
], login );

router.post('/google', [
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignIn );

router.get('/', validarJWT, renovarToken)

module.exports = router;
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { 
    obtenerProductos, 
    obtenerProductoId, 
    crearProducto, 
    actualizarProducto, 
    borrarProducto } = require('../controllers/productos.controller');

const { validarJWT } = require('../middlewares');
const { existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

router.get('/', obtenerProductos);

router.get('/:id',[
check('id', 'No es un ID valido').isMongoId(),
check('id').custom( existeProductoPorId ),
validarCampos    
], obtenerProductoId);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearProducto);

router.put('/:id',[
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos    
],actualizarProducto);

router.delete('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeProductoPorId ), 
    validarCampos 
], borrarProducto );


module.exports = router;
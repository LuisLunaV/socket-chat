const { Router } = require('express');
const { check } = require('express-validator');
const { 
        crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria, 
        borrarCategoria
    } = require('../controllers/categorias.controller');

const { existeCategoriaPorId } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares/index');

const router = Router();

//Obtener todas las categorias
router.get('/', obtenerCategorias);

//Obtener una categoria por id - publico
router.get('/:id',[
check('id', 'No es un ID valido').isMongoId(),
check('id').custom( existeCategoriaPorId ),
validarCampos
],obtenerCategoria);

//Crear categoria - privado - cualquier persona con un token valido
router.post('/',[ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria );

// Actualizar - privado - cualquier con token valido
router.put('/:id',[
validarJWT,
check('id', 'No es un ID valido').isMongoId(),
check('id').custom( existeCategoriaPorId ),
validarCampos
], actualizarCategoria);

//Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
validarCampos
], borrarCategoria)

module.exports = router;

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivoSubir } = require('../middlewares/index');

const { cargarArchivos, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads.controller');
const { coleccionesPermitidas } = require('../helpers/db-validators');


const router = Router();

router.post('/', validarArchivoSubir ,cargarArchivos);

router.put('/:coleccion/:id',[
validarArchivoSubir,
check('id','El ID debe ser de mongo').isMongoId(),
check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
validarCampos
], actualizarImagenCloudinary);
// actualizarImagen

router.get('/:coleccion/:id', [
check('id','El ID debe ser de mongo').isMongoId(),
check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
validarCampos
], mostrarImagen)


module.exports = router;
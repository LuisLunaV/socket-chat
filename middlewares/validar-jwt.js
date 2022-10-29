const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');

const Usuario = require('../models/usuario');

const validarJWT = async( req = request, res = response, next) =>{

    const token = req.header('x-token');
    // console.log(token);

    if( !token ){

        return res.status(401).json({
            msg: 'No hay token de peticion'
        })

    }
    try {
       const { uid } = jwt.verify( token , process.env.SECRETORPRIVATEKEY );

       //Leer el usuario que corresponde al uid
       const usuario = await Usuario.findById( uid );

       //Verifica si el registro fue eliminado fisicamente de la BD
       if( !usuario ){
        return res.status(401).json({
            msg:'Token no valido - usuario no existe en BD'
        });
       }

       //Verificar si uid tiene estado en true //Eliminado
       if( !usuario.estado ){
        return res.status(401).json({
            msg:'Token no valido - usuario con estado false '
        });
       }

       req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no valido'
        })
    }

}

module.exports = {
    validarJWT
}
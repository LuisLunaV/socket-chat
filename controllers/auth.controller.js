const { response, json } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async(req, res)=>{

    const { correo, password } =req.body;

    try {
        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - correo'
            })
        }

        //Validar si el usuario esta activo en mi BD
        if( !usuario.estado ){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - estado: false'
            })
        }

        //Verificar la contraseña
        const contraseñaValida = bcryptjs.compareSync( password, usuario.password);
        if( !contraseñaValida ){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - password invalido'
            })
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({

            usuario,
            token
        });
         
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

const googleSignIn = async(req, res = response) =>{

    const { id_token } = req.body;

    try {
        // const googleUser = await googleVerify( id_token );
        // console.log(googleUser)
        const {nombre, img, correo } = await googleVerify( id_token );
        let usuario = await Usuario.findOne({ correo });
        if( !usuario ){
            //Tengo que crearlo
            const data = {

                nombre,
                correo,
                password: ':p',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        //Si el usuario en BD tiene el estado de false voy a negar su autenticacion
        if( !usuario.estado ){

            return res.status( 401 ).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }
        
        //Generar el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        res.status(400).json({
            ok:false,
            msg: 'El token no se pudo validar'
        })
    }

};

const renovarToken = async( req, res = response)=>{

    const { usuario } = req;

    //Generar el JWT
    const token = await generarJWT( usuario.id );
    res.json({
        usuario,
        token
    })
}
module.exports = {
    login,
    googleSignIn,
    renovarToken
}
const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const users = {

    userGet : async(req = request, res = response)=>{
        
        const { limite = 5, desde = 0 } = req.query;
        const query = { estado: true };

        // const usuarios = await Usuario.find( query )
        // .skip( Number( desde ))
        // .limit( Number( limite ));

        // const total = await Usuario.countDocuments( query );

        const [total, usuarios] = await Promise.all([
            Usuario.countDocuments( query ),
            Usuario.find( query )
            .skip( Number( desde ))
            .limit( Number( limite ))
        ]);
        
        res.status(200).json({
            // resp
            total,
            usuarios
        })
    },

    userPut : async(req, res)=>{
        
        const { id } = req.params;
        //Al dividir los campos {_id, password, google, ...resto}
        //Estoy haciendo que ignoremos (_id, password, google)
        //Y solo querramos guardas lo que esta en el campo resto el cual ya NO los contendra.
        const {_id, password, google, ...resto} = req.body;

        //TODO validar contra base de dato
        if( password ){
             //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync(); //=> Es el numero de vueltas para volver mas complicada la encripatacion bcryptjs.genSaltSync(20), bcryptjs.genSaltSync(100), etc.
        resto.password = bcryptjs.hashSync(password, salt);
        }

        const usuario = await Usuario.findByIdAndUpdate( id, resto ); //findByIdAndUpdate = Buscalo por id y actualizalo
        res.status(500).json({
            usuario
        });
    },

    userPost : async(req, res)=>{
        
        // const {id, nombre, edad} = req.body;
        const {nombre, correo, password, rol} = req.body;
        const usuario = new Usuario( {nombre, correo, password, rol} );

     
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync(); //=> Es el numero de vueltas para volver mas complicada la encripatacion bcryptjs.genSaltSync(20), bcryptjs.genSaltSync(100), etc.
        usuario.password = bcryptjs.hashSync(password, salt);


        //Guardar en base de datos
        await usuario.save();

        res.status(201).json({
            // msg: 'post Api - controlador',
            usuario
        });
    },

    userDelete : async(req, res)=>{
        const { id } = req.params;

        // const uid = req.uid;
        
        // Borrar fisicamente de la BD
        // const usuario = await Usuario.findByIdAndDelete( id );

        //Cambiar el estado del usuario
        const usuario = await Usuario.findByIdAndUpdate( id, {estado:false});
        // const usuarioAutenticado = req.usuario;



        res.status(200).json({
            usuario
            // usuarioAutenticado
        })
    }

};



module.exports = {

    users
};
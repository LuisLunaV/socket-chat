const { response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require("mongoose").Types;

const coleccionesPermitidas = [
'usuarios',
'categoria',
'productos',
'roles'
];

//***
//*Buscar usuarios
//***
const buscarUsuarios = async( termino ='', res = response ) =>{
const esMongoID = ObjectId.isValid( termino ); //Busca por ID'S
if( esMongoID ){
   const usuario = await Usuario.findById( termino );
   return res.json({
        result: (usuario)?[ usuario ]:[]
    })
}

const regex = new RegExp( termino, 'i');//Busca por nombres insensibles de mayusculas y minusculas

const usuarios = await Usuario.find({
    $or: [{ nombre: regex },{ correo: regex }],
    $and: [{ estado: true }]
});

res.json({
    result: usuarios
})
};

//***
//*Buscar categorias
//***
const buscarCategorias = async( termino ='', res = response ) =>{
const esMongoID = ObjectId.isValid( termino ); //TRUE
if ( esMongoID ) {
    const categoria = await Categoria.findById( termino );
    return res.json({
        result: ( categoria )? [ categoria ]: []
    });
}

const regex = new RegExp( termino, 'i');

const categorias = await Categoria.find({ nombre: regex, estado: true });

res.json({
    result: categorias
})
};

//***
//*Buscar productos
//***
const buscarProductos = async( termino ='', res = response )=>{
    const esMongoID = ObjectId.isValid( termino );

    if( esMongoID ){
        const producto = await Producto.findById( termino )
        .populate('categoria', 'nombre');
        
        return res.status(200).json({
            result: ( producto )? [ producto ]:[]
        }) 
    }

const regex = new RegExp( termino, 'i');

const productos = await Producto.find({
    $or : [{  nombre : regex }],
    $and : [{ disponible : true}]
})
.populate('categoria', 'nombre');

res.json({
    result: productos
})

};

//***
//*Seleccionar categorias de la BD
//***
const buscar = ( req, res = response) =>{

    const { coleccion, termino } = req.params;
    
    if( !coleccionesPermitidas.includes( coleccion )){
       return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch( coleccion ){
        case 'usuarios':
            buscarUsuarios( termino, res );
            break;
        case 'categoria':
            buscarCategorias( termino, res )
            break;
        case 'productos':
            buscarProductos( termino, res )
            break;     
        default:
            res.status(500).json({
                msg: 'Fallo esta busqueda'
            })
        break; 
    }
};

module.exports = {
    buscar
}
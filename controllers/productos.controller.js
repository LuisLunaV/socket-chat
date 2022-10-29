const { response, request } = require("express");
const { Producto, Categoria } = require('../models/index');

// ****
//Obtener productos
// ****
const obtenerProductos = async( req, res )=>{
    const { limite = 15, desde = 0 } = req.query;
    const query = {disponible: true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments( query),
        Producto.find( query )
        .populate('usuario','nombre')
        .populate('categoria','nombre')
        .skip( Number( desde )) 
        .limit( Number( limite ))

    ]);

    res.status(201).json({
        total,
        productos,
    });
};

// ****
//Obtener producto con id
// ****
const obtenerProductoId = async( req, res )=>{
const { id } = req.params;
const producto = await Producto.findById( id );

if( !producto.disponible ){
    return res.status(400).json({
        msg: `El producto no esta disponible`
     });
}

res.status(201).json( producto );

};

// ****
//CraerProducto
// ****
const crearProducto = async(req = request, res = response)=>{
const { nombre, descripcion, categoria } = req.body;

//Buscamos en la BD si existe el mismo producto
const productoBD = await Producto.findOne({ nombre });
const categoriaDB = await Categoria.findOne({ nombre : categoria.toUpperCase() });

if( productoBD ){
    return res.status(400).json({
        msg: `El producto ${ productoBD }, ya existe`
     });
}

if( !categoriaDB ){
    return res.status(400).json({
        msg: `La categoria ${ categoria }, no existe`
     });
}

const id = categoriaDB._id;

const data = {
    nombre      : nombre.toUpperCase(),
    descripcion : descripcion.toUpperCase(),
    categoria   : id,
    usuario     : req.usuario._id
}

const producto = new Producto( data );

await producto.save();

res.status(201).json({
    producto
});

};

// ****
//Actualizar producto
// ****
const actualizarProducto = async( req, res ) =>{
    const { id } = req.params;
    const {_id, usuario, categoria, disponible, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.descripcion = data.descripcion.toUpperCase();


    const producto = await Producto.findOneAndUpdate( id, data, {new: true } );

    res.status(200).json({
        producto
    });
};

// ****
//Borrar producto
// ****
const borrarProducto = async( req, res ) =>{
const { id } = req.params;

const { nombre, disponible } =  await Producto.findByIdAndUpdate( id, { disponible: false })


if( !disponible ){
   return res.status(400).json({
        msg:`Producto no disponible`
    });
}

res.status(200).json({
        msg:`Producto ${ nombre } se ha eliminado`
    });

};
module.exports = {
   obtenerProductos,
   obtenerProductoId,
   crearProducto,
   actualizarProducto,
   borrarProducto
}
const { response, request } = require("express");
const { Categoria } = require('../models/index')


//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async( req = request, res = response)=>{
const { limite = 10, desde = 0 } = req.query;
const query = { estado: true};

const [total, categorias, usuario] = await Promise.all([
    Categoria.countDocuments( query ), //Contar el total de registros
    Categoria.find( query ) //Mostrar los registros
    .skip( Number( desde )) //desde
    .limit( Number( limite )) //limite
    .populate('usuario','nombre') //('campo_referencia', 'nombre_propiedad')
]);

res.status(200).json({
    limite,
    total,
    categorias,
    usuario
})

};
//obtenerCategoria - populate {}
const obtenerCategoria = async(req, res) =>{
const { id } = req.params;
const categoria = await Categoria.findById( id )
.populate('usuario','nombre')

res.status(200).json({
    categoria
})
}

const crearCategoria = async(req, res=response) =>{

    //Leemos el nombre que viene del body y lo capitalizamos.
    const nombre = req.body.nombre.toUpperCase();
    //Preguntamos si existe una categoria con el "nombre!
    const categoriaDB = await Categoria.findOne({ nombre });

    //Si existe mandamos un error indicando que la categoria ya existe.
    if( categoriaDB ){
         return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
         });
    }
    
    // Generar la data a guardar 
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );

    // Guardar DB
    await categoria.save();

    res.status(201).json( categoria );


};

//actualizarCategoria
const actualizarCategoria = async( req, res )=>{
const { id } = req.params;
const {_id, estado, usuario, ...data} = req.body;

       data.nombre = data.nombre.toUpperCase();
       data.usuario = req.usuario._id;

const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

res.status(200).json({
   categoria
})

};

//borrarCategoria - estado:false
const borrarCategoria = async(req, res)=>{
    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate( id, {estado:false });

    res.status(200).json({
        categoria
    });
    

};

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}
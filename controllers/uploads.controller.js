const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");
const subirArchivos = require('../helpers/subir-archivo');
const { Usuario, Producto } = require('../models')


const cargarArchivos = async( req, res = response) =>{
  
    // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    //    return res.status(400).json({
    //     msg: 'No hay archivos para subir'
    //   });
    // }
  

    try {
      //Imagenes - helper: subir-archivo.js
      // const nombre = await subirArchivos( req.files, ['txt','md'], 'textos');
      const nombre = await subirArchivos( req.files, undefined, 'imgs');
      return res.status(200).json(nombre);

    } catch (msg) {
     res.status(400).json({msg}) 
    }

};

const actualizarImagen = async(req, res = response) =>{

const { coleccion, id } = req.params;

let modelo;

switch( coleccion ){

  case 'usuarios':
  modelo = await Usuario.findById( id );
  if( !modelo ){
    return res.status(400).json({
      msg:`El ID: ${id} no existe en la BD`
    })
  }
  break;
  case 'productos':
    modelo = await Producto.findById( id );
    if( !modelo ){
      return res.status(400).json({
        msg:`El ID: ${id} no existe en la BD`
      })
    }
  break;

  default:
    return res.status(500).json({
      msg: 'Pendiente de crear'
    })

}

//Limpiar imagenes previas
  if( modelo.img ){
    //Hay que borrar la imagen del servidor
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img );
    if( fs.existsSync( pathImagen ) ){ //Si en el fileSystem el archivo existe ( pathImagen ) devolver un 'TRUE'
      //Si existe borramos la imagen
      fs.unlinkSync( pathImagen )
    }
  }

  const nombre = await subirArchivos( req.files, undefined, coleccion);
  modelo.img = nombre;
  
  await modelo.save();
  res.json( modelo );

};

const actualizarImagenCloudinary = async(req, res = response) =>{

  const { coleccion, id } = req.params;
  
  let modelo;
  
  switch( coleccion ){
  
    case 'usuarios':
    modelo = await Usuario.findById( id );
    if( !modelo ){
      return res.status(400).json({
        msg:`El ID: ${id} no existe en la BD`
      })
    }
    break;
    case 'productos':
      modelo = await Producto.findById( id );
      if( !modelo ){
        return res.status(400).json({
          msg:`El ID: ${id} no existe en la BD`
        })
      }
    break;
  
    default:
      return res.status(500).json({
        msg: 'Pendiente de crear'
      })
  
  }
  
  //Limpiar imagenes previas
    if( modelo.img ){
      const nombreArr = modelo.img.split('/').reverse()[0];
      const [public_id] = nombreArr.split('.');
      //Eliminamos imagen anterior de cloudinary
      await cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.archivo;
    //Subimos la imagen a cloudinary
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    modelo.img = secure_url;

    await modelo.save();

    res.json( modelo );
  
  };
  

// Mostramos imagen
const mostrarImagen = async( req, res = response)=>{
  
  const { coleccion, id } = req.params;

  let modelo;
  
  switch( coleccion ){
  
    case 'usuarios':
    modelo = await Usuario.findById( id );
    if( !modelo ){
      return res.status(400).json({
        msg:`El ID: ${id} no existe en la BD`
      })
    }
    break;
    case 'productos':
      modelo = await Producto.findById( id );
      if( !modelo ){
        return res.status(400).json({
          msg:`El ID: ${id} no existe en la BD`
        })
      }
    break;
  
    default:
      return res.status(500).json({
        msg: 'Pendiente de crear'
      })
  
  }
  

  //Validamos si la imagen existe
    if( modelo.img ){
      //Llamamos la imagen desde el path
      const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img );
      if( fs.existsSync( pathImagen ) ){ //Si en el fileSystem el archivo existe ( pathImagen ) devolver un 'TRUE'
        //Mostramos la imagen
       return res.sendFile( pathImagen );
      }
    }

    //Si la imagen no existe, mostramos la imagen de error.
    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile( pathImagen );  
}

module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivos = ( files ='', extensionesValidas = ['jpg','png','jpeg','gif'], carpeta = '') =>{

    return new Promise((resolve, reject)=>{

        const { archivo } = files;
        const extension = archivo.name.split('.').reverse()[0];
    
    // **
    // Validamos la extension del archivo
    // **
    if( !extensionesValidas.includes( extension )){
      reject( `La extension ${ extension } no esta permitida, ${ extensionesValidas }`)
    }

    // **
    // Guardamos el archivo en la carpeta seliccionada
    // **
    const nombreTemp = `${uuidv4()}.${extension}`;
    const uploadPath = path.join( __dirname, '../uploads/' , carpeta, nombreTemp);
  
    archivo.mv(uploadPath, (err)=> {
      if (err){
        reject(err)
      }

      resolve( nombreTemp );

    });

    });

};

module.exports = subirArchivos;
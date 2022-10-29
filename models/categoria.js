const {Schema, model} = require('mongoose');

const CategoriasSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado : {
        type: Boolean,
        default: true,
        required: true,
        
    },
    usuario : {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }

});

CategoriasSchema.methods.toJSON = function() {
    const {__v, estado, ...data} = this.toObject();
    return data;
}

module.exports= model('Categoria', CategoriasSchema);
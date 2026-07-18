const mongoose = require('mongoose');

const departamentoSchema = new mongoose.Schema({
    nombre: { 
        type: String,
        required: true 
    },
    descripcion: { 
        type: String 
    }
});

module.exports = mongoose.model('Departamento', departamentoSchema);


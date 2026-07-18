const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const proyectoSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    descripcion: { 
        type: String 
    },
    fecha_inicio: { 
        type: Date 
    },
    fecha_fin: { 
        type: Date 
    },
    estado: { 
        type: String,
        enum: ['En curso', 'Finalizado', 'Detenido', 'Pendiente', 'Cancelado'], 
        default: 'Pendiente'
    } 
});

module.exports = mongoose.model('Proyecto', proyectoSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const evaluacionSchema = new mongoose.Schema({
  fecha: { 
    type: Date, 
    required: true,
    default: Date.now 
},
  calificacion: { 
    type: Number, // enum ["Regular", "Deficiente", "Excelente", "Bien"]
    required: true 
}, 
  comentarios: { 
    type: String 
},
  evaluador: { 
    type: Schema.Types.ObjectId, 
    ref: 'Empleado', 
    required: true 
},
  empleado: { 
    type: Schema.Types.ObjectId, 
    ref: 'Empleado', 
    required: true 
} 
});

module.exports = mongoose.model('Evaluacion', evaluacionSchema);
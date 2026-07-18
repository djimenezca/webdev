const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const atestadoSchema = new mongoose.Schema({
  nombreDocumento: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true,
    enum: ['Diploma', 'Certificado', 'Titulo', 'Constancia', 'Otro'] // Valores permitidos (enum: Restringe los valores permitidos a un conjunto específico predefinido)
  },
  urlArchivo: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now // Fecha actual por defecto
  },
  empleado: {
    type: Schema.Types.ObjectId,
    ref: 'Empleado',
    required: true
  }
});

module.exports = mongoose.model('Atestado', atestadoSchema);

/*
Atestado: 
Nombre: Técnico en desarrollo de software
Tipo: Titulo
URL: www
fecha: 30/04/2025
empleado: 
    - Nombre: Rose
    - Correo: rose@test.com
*/
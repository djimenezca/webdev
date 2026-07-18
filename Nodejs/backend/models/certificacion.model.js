const mongoose = require("mongoose")

// Creación del esquema
const schemaCertificacion = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    institucion: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    vigencia: {
        expira: {
            type: Boolean,
            default: false
        },
        fechaExpiracion: {
            type: Date,
            default: null
        }
    }
});

module.exports = mongoose.model("Certificacion", schemaCertificacion); 
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creación del esquema
const schemaEmpleado = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: false
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    contrasenia: {
        type: String,
        required: true,
    },
    direccion: {
        provincia: {
            type: String,
            required: true,
        },
        distrito: {
            type: String,
            required: true,
        },
        canton: {
            type: String,
            required: true,
        },
        ubicacion: {
            type: String
        }
    },
    certificaciones: [
        {
            type: Schema.Types.ObjectId,
            ref: "Certificacion"
        }
    ],
    departamento: {
        type: Schema.Types.ObjectId,
        ref: 'Departamento'
    },
    proyectos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Proyecto'
        }
    ]
});

const Empleado = mongoose.model("Empleado", schemaEmpleado);
module.exports = Empleado; // Exportar el modelo para utilizarlo en el backend  


/* 

Ejemplo de consultar toda la información de un empleado: 
nombre: Roberto
correo: roberto@test.com
contrasenia: 123
direccion: {Puntarenas, BA, BA}
certificaciones: [
    1. TypeScript, CENFOTEC
    2. JavaScript, FUNDATEC
    3. Angular, CENFOTEC
]
departamento: TI - Desarrollo
proyectos: [
    1. Eventos 
    2. Auditoría
]
*/ 
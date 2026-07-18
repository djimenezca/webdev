const express = require("express");
const router = express.Router();
const Atestado = require("../models/atestado.model");
const Empleado = require("../models/empleado.model");

// Guía de status de error: https://developer.mozilla.org/es/docs/Web/HTTP/Reference/Status 

router.post("/", async (req, res) => {
    const { nombreDocumento, tipo, urlArchivo, fecha, empleado } = req.body;

    // Validar campos obligatorios 
    if (!nombreDocumento || !tipo || !urlArchivo || !empleado) {
        return res.status(400).json({ mensajeError: "Los campos nombre del documento, tipo, URL del archivo y id empleado son obligatorios" });
    }

    // Validar que el tipo esté dentro de los valores permitidos por el enum
    const tiposPermitidos = ['Diploma', 'Certificado', 'Titulo', 'Constancia', 'Otro'];
    if (!tiposPermitidos.includes(tipo)) {
        return res.status(400).json({ mensajeError: "El tipo debe ser uno de: " + tiposPermitidos.join(', ')});
    }

    // Validar que el empleado exista en la DB
    try {
        const empleadoExistente = await Empleado.findById(empleado);
        if (!empleadoExistente) {
            return res.status(400).json({ mensajeError: "El empleado especificado no existe" });
        }
    } catch (error) {
        return res.status(400).json({ mensajeError: "El ID del empleado no es válido" });
    }

    try {
        const nuevoAtestado = new Atestado({ nombreDocumento, tipo, urlArchivo, fecha: fecha || undefined, empleado});
        // Si fecha ===  undefined, mongoose usa el default
        await nuevoAtestado.save();
        res.status(201).json(nuevoAtestado);

    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});

/* Ejemplo de body para POST: http://localhost:3000/atestados
{
  "nombreDocumento": "Diploma de Inglés",
  "tipo": "Diploma",
  "urlArchivo": "www.compresor.net",
  "empleado": "69b361259248f6ff050bb2e0" 
}
*/

router.get("/", async (req, res) => {
    try {
        const atestados = await Atestado.find().populate('empleado');
        res.json(atestados);
    } catch (error) {
        res.status(500).json({ msj: "Error al obtener los atestados", error });
    }
});

module.exports = router;


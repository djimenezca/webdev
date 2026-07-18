const express = require('express');
const router = express.Router();
const Proyecto = require('../models/proyecto.model');

// Crear un proyecto
router.post("/", async (req, res) => {
    const { nombre, descripcion, fecha_inicio, fecha_fin, estado } = req.body;

    if (!nombre) {
        return res.status(400).json({ mensajeError: "El nombre es obligatorio" });
    }

    try {
        const nuevoProyecto = new Proyecto({ nombre, descripcion, fecha_inicio, fecha_fin, estado });
        await nuevoProyecto.save();
        res.status(201).json({ mensaje: "Proyecto creado", proyecto: nuevoProyecto });
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});
/*
http://localhost:3000/proyectos
{
  "nombre": "Aero cargo",
  "fecha_inicio": "2026-01-26",
  "estado": "En curso" 
}
*/

// Obtener todos los proyectos
router.get("/", async (req, res) => {
    try {
        const proyectos = await Proyecto.find();
        res.status(200).json(proyectos);
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});

// Obtener un proyecto por ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const proyecto = await Proyecto.findById(id);
        if (!proyecto) {
            return res.status(404).json({ error: "Proyecto no encontrado" });
        }
        res.status(200).json(proyecto);
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});
/*

*/

// Actualizar un proyecto
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, fecha_inicio, fecha_fin, estado } = req.body;

    try {
        const proyecto = await Proyecto.findByIdAndUpdate(
            id,
            { nombre, descripcion, fecha_inicio, fecha_fin, estado },
            { returnDocument: 'after', runValidators: true }
        );
        if (!proyecto) {
            return res.status(404).json({ error: "Proyecto no encontrado" });
        }
        res.status(200).json({ mensaje: "Proyecto actualizado", proyecto });
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});
/*

*/

// Eliminar un proyecto
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const proyecto = await Proyecto.findByIdAndDelete(id);
        if (!proyecto) {
            return res.status(404).json({ error: "Proyecto no encontrado" });
        }
        res.status(200).json({ mensaje: "Proyecto eliminado" });
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});
/*
 
*/

module.exports = router;
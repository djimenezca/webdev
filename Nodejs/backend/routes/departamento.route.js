const express = require("express");
const router = express.Router(); 
const Departamento = require("../models/departamento.model");

// Crear un departamento
router.post("/", async (req, res) => {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
        return res.status(400).json({ mensajeError: "El nombre es obligatorio" });
    }

    try {
        const nuevoDepartamento = new Departamento({ nombre, descripcion });
        await nuevoDepartamento.save();
        res.status(201).json({ mensaje: "Departamento creado", departamento: nuevoDepartamento });
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});

/*
http://localhost:3000/departamentos
{
"nombre": "Desarrollo",
"descripcion": "Backend"
}
*/

// Obtener todos los departamentos
router.get("/", async (req, res) => {
    try {
        const departamentos = await Departamento.find();
        res.status(200).json(departamentos);
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});

// Obtener un departamento por ID
router.get("/departamento/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const departamento = await Departamento.findById(id);
        if (!departamento) {
            return res.status(404).json({ error: "Departamento no encontrado" });
        }
        res.status(200).json(departamento);
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});

// Actualizar un departamento
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    try {
        const departamento = await Departamento.findByIdAndUpdate(
            id,
            { nombre, descripcion },
            { returnDocument: 'after', runValidators: true }
        );
        if (!departamento) {
            return res.status(404).json({ error: "Departamento no encontrado" });
        }
        res.status(200).json({ mensaje: "Departamento actualizado", departamento });
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});

// Eliminar un departamento
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const departamento = await Departamento.findByIdAndDelete(id);
        if (!departamento) {
            return res.status(404).json({ error: "Departamento no encontrado" });
        }
        res.status(200).json({ mensaje: "Departamento eliminado" });
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});

module.exports = router;
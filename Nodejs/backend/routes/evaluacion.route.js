const express = require('express');
const router = express.Router();
const Evaluacion = require('../models/evaluacion.model');
const Empleado = require('../models/empleado.model');

// Crear una evaluación
router.post("/", async (req, res) => {
    const { fecha, calificacion, comentarios, evaluador, empleado } = req.body;

    if (!calificacion || !evaluador || !empleado) {
        return res.status(400).json({ mensajeError: "Calificación, evaluador y empleado son obligatorios" });
    }

    try {
        // Verificar que evaluador y empleado existan
        const evaluadorExiste = await Empleado.findById(evaluador);
        const empleadoExiste = await Empleado.findById(empleado);
        if (!evaluadorExiste || !empleadoExiste) {
            return res.status(404).json({ error: "Evaluador o empleado no encontrado" });
        }

        const nuevaEvaluacion = new Evaluacion({ fecha, calificacion, comentarios, evaluador, empleado });
        await nuevaEvaluacion.save();
        res.status(201).json({ mensaje: "Evaluación creada", evaluacion: nuevaEvaluacion });
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});
/*
http://localhost:3000/evaluaciones
{
    "calificacion": 100,
    "comentarios": "Plan de mejora: Obtener certificación en Go",
    "evaluador": "69c57a8336fdfff5e26e0d30",
    "empleado": "69c57a6e36fdfff5e26e0d2e"
}
*/

// Obtener todas las evaluaciones (con populate de evaluador y empleado)
router.get("/", async (req, res) => {
    try {
        const evaluaciones = await Evaluacion.find()
            .populate('evaluador', 'nombre correo')
            .populate('empleado', 'nombre correo');
        res.status(200).json(evaluaciones);
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});

// Obtener evaluación por ID
router.get("/evaluacion/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const evaluacion = await Evaluacion.findById(id).populate('evaluador', 'nombre correo').populate('empleado', 'nombre correo');
        if (!evaluacion) {
            return res.status(404).json({ error: "Evaluación no encontrada" });
        }
        res.status(200).json(evaluacion);
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});
/*
http://localhost:3000/evaluaciones/evaluacion/69c59f900e30235b57433c1e
*/

// Actualizar una evaluación
router.put("/evaluacion/:id", async (req, res) => {
    const { id } = req.params;
    const { fecha, calificacion, comentarios, evaluador, empleado } = req.body;

    try {
        // Verificar que evaluador y empleado existan si se envían
        if (evaluador) {
            const evaluadorExiste = await Empleado.findById(evaluador);
            if (!evaluadorExiste) return res.status(404).json({ error: "Evaluador no encontrado" });
        }
        if (empleado) {
            const empleadoExiste = await Empleado.findById(empleado);
            if (!empleadoExiste) return res.status(404).json({ error: "Empleado no encontrado" });
        }

        const evaluacion = await Evaluacion.findByIdAndUpdate(
            id,
            { fecha, calificacion, comentarios, evaluador, empleado },
            {  returnDocument: 'after', runValidators: true  }
        );
        if (!evaluacion) {
            return res.status(404).json({ error: "Evaluación no encontrada" });
        }
        res.status(200).json({ mensaje: "Evaluación actualizada", evaluacion });
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});
/*
http://localhost:3000/evaluaciones/evaluacion/69c59f900e30235b57433c1e
{
    "calificacion": 98,
    "comentarios": "No completó el plan de mejora propuesto durante el 2025"
}
*/

// Eliminar una evaluación
router.delete("/evaluacion/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const evaluacion = await Evaluacion.findByIdAndDelete(id);
        if (!evaluacion) {
            return res.status(404).json({ error: "Evaluación no encontrada" });
        }
        res.status(200).json({ mensaje: "Evaluación eliminada" });
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});
/*
http://localhost:3000/evaluaciones/evaluacion/69c59f900e30235b57433c1e
*/

module.exports = router;
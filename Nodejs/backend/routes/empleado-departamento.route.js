const express = require("express");
const router = express.Router(); // Crear la señal 
const Empleado = require("../models/empleado.model");
const Departamento = require("../models/departamento.model");

// Obtener empleados por departamento 
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const empleados = await Empleado.find({ departamento: id })
            .select('nombre correo proyectos')  // Solo estos campos del empleado
            .populate('departamento', 'nombre') // Solo el nombre del departamento
            .populate('proyectos', 'nombre')    // Solo el nombre de los proyectos
            .lean(); // Mejora rendimiento y devuelve objetos planos

        // Opcional: formatear la respuesta para que sea más limpia
        const empleadosFormateados = empleados.map(emp => ({
            nombre: emp.nombre,
            correo: emp.correo,
            departamento: emp.departamento?.nombre || null,
            proyectos: emp.proyectos.map(p => p.nombre)
        }));

        res.status(200).json(empleadosFormateados);
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});
/*
http://localhost:3000/empleados-departamento/69c587ea5b6e31a085e30922
*/

// Cantidad de empleados por departamento 
router.get('/', async (req, res) => {
    try {
        const stats = await Empleado.aggregate([
            {
                $lookup: {
                    from: 'departamentos',
                    localField: 'departamento',
                    foreignField: '_id',
                    as: 'departamentoInfo'
                }
            },
            { $unwind: { path: '$departamentoInfo', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: { $ifNull: ['$departamentoInfo.nombre', 'Sin departamento'] },
                    cantidad: { $sum: 1 }
                }
            },
            { $sort: { cantidad: -1 } }
        ]);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
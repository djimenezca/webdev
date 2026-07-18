const express = require('express');
const router = express.Router();
const Empleado = require('../models/empleado.model');
const Departamento = require('../models/departamento.model');
const Proyecto = require('../models/proyecto.model');
const Evaluacion = require('../models/evaluacion.model');
const Certificacion = require('../models/certificacion.model');
const Atestado = require('../models/atestado.model');

router.get('/cantidad-empleados', async (req, res) => {
    try {
        const count = await Empleado.countDocuments();
        res.json({ cantidad: count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/*
http://localhost:3000/estadisticas/cantidad-empleados
*/

router.get('/cantidad-proyectos', async (req, res) => {
    try {
        const count = await Proyecto.countDocuments();
        res.json({ cantidad: count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/*
http://localhost:3000/estadisticas/cantidad-proyectos
*/

router.get('/cantidad/certificaciones', async (req, res) => {
    try {
        const count = await Certificacion.countDocuments();
        res.json({ cantidad: count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/*
http://localhost:3000/estadisticas/cantidad/certificaciones
*/

router.get('/proyectos-por-estado', async (req, res) => {
    try {
        const stats = await Proyecto.aggregate([
            {
                $group: {
                    _id: '$estado',
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
/*
http://localhost:3000/estadisticas/proyectos-por-estado
*/

router.get('/empleados-por-proyecto', async (req, res) => {
    try {
        const stats = await Proyecto.aggregate([
            {
                $lookup: {
                    from: 'empleados',
                    localField: '_id',
                    foreignField: 'proyectos',
                    as: 'empleados'
                }
            },
            {
                $project: {
                    _id: 1,
                    nombre: 1,
                    cantidadEmpleados: { $size: '$empleados' }
                }
            },
            { $sort: { cantidadEmpleados: -1 } }
        ]);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/*
http://localhost:3000/estadisticas/empleados-por-proyecto
*/

router.get('/top-5-certificaciones', async (req, res) => {
    try {
        const stats = await Empleado.aggregate([
            { $unwind: '$certificaciones' },
            {
                $lookup: {
                    from: 'certificacions',
                    localField: 'certificaciones',
                    foreignField: '_id',
                    as: 'certInfo'
                }
            },
            { $unwind: '$certInfo' },
            {
                $group: {
                    _id: '$certInfo.nombre',
                    cantidad: { $sum: 1 }
                }
            },
            { $sort: { cantidad: -1 } },
            { $limit: 5 }
        ]);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/*
http://localhost:3000/estadisticas/top-5-certificaciones
*/

module.exports = router;
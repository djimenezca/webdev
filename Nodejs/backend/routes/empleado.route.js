const express = require("express");
const router = express.Router(); // Crear la señal 
const Empleado = require("../models/empleado.model");
const Certificacion = require("../models/certificacion.model");
const Departamento = require("../models/departamento.model");
const Proyecto = require("../models/proyecto.model");

//Rutas
//POST: Crear/enviar un nuevo dato a la BD
router.post("/", async(req, res) => {
    const {nombre, correo, contrasenia, direccion} = req.body;

    if(!nombre || !correo || !contrasenia || !direccion){
        return res.status(400).json({mensajeError: "Todos los datos son obligatorios"});
    }

    // Validar los campos anidados de la dirección
    const {provincia, canton, distrito} = direccion;
    if (!provincia || !canton || !distrito){
        return res.status(400).json({mensajeError: "La dirección debe incluir provincia, canton y distrito"});
    }
    
    try{
        const nuevoEmpleado = new Empleado({nombre, correo, contrasenia, direccion});
        await nuevoEmpleado.save();
        res.status(201).json(nuevoEmpleado); 
    } catch(error){
        res.status(400).json({mensajeError: error.message});
    }
});

/*
http://localhost:3000/empleados
{
  "nombre": "roberto",
  "correo": "roberto@test.net",
  "contrasenia": "123",
  "direccion":{
      "provincia": "Cartago",
      "distrito": "Oriental",
      "canton": "Central"
  }
}
*/

// GET: Solicitar los datos de los empleados a la BD
router.get("/", async(req, res) =>{
    try{
        const empleados = await Empleado.find() .populate("certificaciones")   // Popular certificaciones
            .populate("proyectos")          // Popular proyectos
            .populate("departamento")       // Popular departamento
            .select("-contrasenia");        // Excluir contraseña por seguridad
        res.json(empleados);
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

// Buscar los empleados con una certificación o con alguna coincidencia en el nombre de la certificación



// PUT: Agregar una certificación a un empleado
router.put("/agregar-certificacion", async(req, res) =>{
    const {correo, certificacionId} = req.body;

    if(!correo || !certificacionId){
        return res.status(400).json({mensajeError: "Correo y ID de la certificación son obligatorios"});
    }
    
    try{
        // Verificar que la certificación existe
        const certificacion = await Certificacion.findById(certificacionId);
        if (!certificacion){
            return res.status(404).json({error: "Certificación no encontrada"});
        }

        // Buscar el usuario y agregar la certificación
        const empleado = await Empleado.findOne({correo});
        if (!empleado){
            return res.status(404).json({error: "Empleado no encontrado"});
        }
        if (!empleado.certificaciones.includes(certificacionId)){
            empleado.certificaciones.push(certificacionId);
            await empleado.save();
        }
        res.status(200).json({msj: "Certificación agregada al empleado", empleado});
        
    } catch(error){
        res.status(400).json({mensajeError: error.message});
    }
});

/*
http://localhost:3000/empleados/agregar-certificacion
{
  "correo": "alberto@test.net",
  "certificacionId": "69c57eda36fdfff5e26e0d34"
}
*/

// Asignar departamento a un empleado 
router.put("/asignar-departamento", async (req, res) => {
    const { correo, departamentoId } = req.body;

    if (!correo || !departamentoId) {
        return res.status(400).json({ mensajeError: "Correo e ID del departamento son obligatorios" });
    }

    try {
        // Verificar que el departamento existe
        const departamento = await Departamento.findById(departamentoId);
        if (!departamento) {
            return res.status(404).json({ error: "Departamento no encontrado" });
        }

        // Buscar el empleado y asignar el departamento
        const empleado = await Empleado.findOne({ correo });
        if (!empleado) {
            return res.status(404).json({ error: "Empleado no encontrado" });
        }

        empleado.departamento = departamentoId;
        await empleado.save();

        res.status(200).json({ msj: "Departamento asignado al empleado", empleado });
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});
/*
http://localhost:3000/empleados/asignar-departamento
{
  "correo": "daniela@test.net",
  "departamentoId": "69c587ea5b6e31a085e30922"
}
*/

// Asignar un proyecto a un empleado
router.put("/agregar-proyecto", async (req, res) => {
    const { correo, proyectoId } = req.body;

    if (!correo || !proyectoId) {
        return res.status(400).json({ mensajeError: "Correo e ID del proyecto son obligatorios" });
    }

    try {
        // Verificar que el proyecto existe
        const proyecto = await Proyecto.findById(proyectoId);
        if (!proyecto) {
            return res.status(404).json({ error: "Proyecto no encontrado" });
        }

        // Buscar el empleado y agregar el proyecto
        const empleado = await Empleado.findOne({ correo });
        if (!empleado) {
            return res.status(404).json({ error: "Empleado no encontrado" });
        }

        if (!empleado.proyectos.includes(proyectoId)) {
            empleado.proyectos.push(proyectoId);
            await empleado.save();
        }

        res.status(200).json({ msj: "Proyecto agregado al empleado", empleado });
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});
/*
http://localhost:3000/empleados/agregar-proyecto
{
  "correo": "alberto@test.net",
  "proyectoId": "69c58682bc622794ebb39342"
}
*/

// Eliminar un proyecto de un empleado
router.put("/eliminar-proyecto", async (req, res) => {
    const { correo, proyectoId } = req.body;

    if (!correo || !proyectoId) {
        return res.status(400).json({ mensajeError: "Correo e ID del proyecto son obligatorios" });
    }

    try {
        const empleado = await Empleado.findOne({ correo });
        if (!empleado) {
            return res.status(404).json({ error: "Empleado no encontrado" });
        }

        empleado.proyectos = empleado.proyectos.filter(id => id.toString() !== proyectoId);
        await empleado.save();

        res.status(200).json({ msj: "Proyecto eliminado del empleado", empleado });
    } catch (error) {
        res.status(400).json({ mensajeError: error.message });
    }
});
/*
http://localhost:3000/empleados/eliminar-proyecto
{
  "correo": "alberto@test.net",
  "proyectoId": "69c58682bc622794ebb39342"
}
*/

// TODO: Eliminar una certificación de un empleado

module.exports = router;
/* Seleccionar los elementos del DOM */
const inputCedula = document.getElementById("identificacion");
const inputNombre = document.getElementById("nombre-completo");
const inputCorreo = document.getElementById("correo");
const inputTelefono = document.getElementById("telefono");
const inputFechaRegistro = document.getElementById("fecha-registro");

const btnRegistrarEgresado = document.getElementById("guardar-egresado");

// Todos los campos obligatorios 
const inputsRequeridos = document.querySelectorAll("input[required]");

// Contenedor de lugares de trabajo y botón agregar
const lugaresContainer = document.getElementById("lugares-container"); // div donde se van a agregar de manera dinámica los lugares de trajo
const btnAgregarLugar = document.getElementById("agregar-lugar-btn"); 
const templateLugar = document.getElementById("template-lugar"); // Plantilla para cada lugar de trabajo que se agregue 

let contadorLugares = 0; // Contador de lugares de trabajo agregados (para generar IDs únicos)

function validarCedula(numeroCedula) {
    return /^[0-9]{9}$/.test(numeroCedula);
}

function validarNombreCompleto(nombre) {
    return nombre.length >= 2;
}

function validarCorreo(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo); // Uno o más caracteres que no sean espacios ni arrobas, seguido de una arroba, otro bloque similar, un punto y otro bloque final sin espacios ni arrobas.
}

function validarTelefono(telefono) {
    return /^[0-9]{8,12}$/.test(telefono); // Dígitos numéricos, con una longitud total de entre 8 y 12 caracteres, desde el inicio hasta el final
}

function establecerFechaActual() {
    const hoy = new Date(); // Objeto Date que representa la fecha y hora actual 
    const anio = hoy.getFullYear();
    /* 
    getMonth(): Devuelve el mes como un número de 0 al 11
              + 1: Mes del 1 al 12
    padStart(2, "0"): en los meses de solo un número (1 - 9) agrega un 0 antes (01 - 09)
    */
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); 
    const dia = String(hoy.getDate()).padStart(2, '0');
    /*
    A inputFechaRegistro se le asigna el atributo value interpolando las variables
    */
    inputFechaRegistro.value = `${anio}-${mes}-${dia}`;
}

function resaltarCamposVacios() {
    let error = false; // Asumir que no hay error 

    // Identificación
    const cedula = inputCedula.value.trim();
    if (!validarCedula(cedula)) { // No cumple con el formato
        inputCedula.classList.add("input-error");
        error = true;
    } else {
        inputCedula.classList.remove("input-error");
    }

    // Nombre
    const nombre = inputNombre.value.trim();
    if (!validarNombreCompleto(nombre)) {
        inputNombre.classList.add("input-error");
        error = true;
    } else {
        inputNombre.classList.remove("input-error");
    }

    // Correo
    const correo = inputCorreo.value.trim();
    if (!validarCorreo(correo)) {
        inputCorreo.classList.add("input-error");
        error = true;
    } else {
        inputCorreo.classList.remove("input-error");
    }

    // Teléfono
    const telefono = inputTelefono.value.trim();
    if (!validarTelefono(telefono)) {
        inputTelefono.classList.add("input-error");
        error = true;
    } else {
        inputTelefono.classList.remove("input-error");
    }

    return error;
}

function validarCamposVacios() {
    const error = resaltarCamposVacios();
    if (error) {
        Swal.fire({
            title: "No se puede registrar el egresado",
            text: "Complete los campos resaltados.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
    } else {
        Swal.fire({
            title: "Egresado registrado correctamente",
            text: "Los datos han sido guardados correctamente.",
            icon: "success",
            confirmButtonText: "Aceptar"
        });
    }
}

/**
 * Actualiza los atributos (id, for, data-index) de un bloque para que
 * coincidan con el índice proporcionado.
 */
function actualizarIndices(bloque, nuevoIndice) {
    bloque.dataset.index = nuevoIndice;

    // Actualizar id de inputs y atributos aria-describedby
    const inputs = bloque.querySelectorAll("input");
    inputs.forEach((input) => {
        const baseId = input.id.replace(/\d+$/, ""); // elimina el número final
        input.id = baseId + nuevoIndice;

        const ayudaId = input.getAttribute("aria-describedby");
        if (ayudaId) {
            const nuevaAyudaId = ayudaId.replace(/\d+$/, nuevoIndice);
            input.setAttribute("aria-describedby", nuevaAyudaId);
        }
    });

    // Actualizar for de los labels
    const labels = bloque.querySelectorAll("label");
    labels.forEach((label) => {
        const forAttr = label.getAttribute("for");
        if (forAttr) {
            const baseFor = forAttr.replace(/\d+$/, "");
            label.setAttribute("for", baseFor + nuevoIndice);
        }
    });

    // Actualizar id de los spans de ayuda
    const ayudas = bloque.querySelectorAll(".texto-oculto");
    ayudas.forEach((ayuda) => {
        const idAyuda = ayuda.id;
        if (idAyuda) {
            const baseIdAyuda = idAyuda.replace(/\d+$/, "");
            ayuda.id = baseIdAyuda + nuevoIndice;
        }
    });
}

/**
 * Crea un nuevo bloque de lugar de trabajo a partir del template,
 * le asigna un índice único y lo devuelve.
 */
function crearBloqueLugar() {
    const clon = templateLugar.content.cloneNode(true);
    const bloque = clon.firstElementChild; // div.bloque-lugar

    const nuevoIndice = contadorLugares++;
    actualizarIndices(bloque, nuevoIndice);

    // Agregar evento al botón eliminar
    const btnEliminar = bloque.querySelector(".eliminar-lugar");
    btnEliminar.addEventListener("click", function (e) {
        e.preventDefault();
        bloque.remove();
    });

    return bloque;
}


establecerFechaActual();

// Evento del botón guardar/registrar 
btnRegistrarEgresado.addEventListener("click", validarCamposVacios);

// Evento del botón agregar lugar de trabajo
btnAgregarLugar.addEventListener("click", function (e) {
    e.preventDefault(); // Desactivar la accción predeterminada para tener control de qué debe hacer
    const bloque = crearBloqueLugar();
    lugaresContainer.appendChild(bloque);
});
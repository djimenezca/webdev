const inputNombre = document.getElementById("nombreCertificacion");
const inputFechaVigencia = document.getElementById("fechaExpiracion");
const inputInstitucion = document.getElementById("institucion");

const inputDescripcion = document.querySelector("#descripcion");
// const inputDescripcion = document.getElementById("descripcion");
const btnGuardarCertificacion = document.querySelector("#btnGuardar");
const formulario = document.getElementById("formNuevaCertificacion");
const chkExpira = document.getElementById("expira");
const contenedorFecha = document.getElementById("contenedorFecha");

const inputsRequeridos = document.querySelectorAll("input[required]"); // Selecccionar todos los input obligatorios

function validar() {
    let error = false;
    for (const element of inputsRequeridos) {
        if (element.value === "") {
            error = true;
            Swal.fire({
                title: "No se puede registrar la certificación",
                text: "Por favor complete los campos resaltados.",
                icon: "warning",
                confirmButtonText: "Aceptar"
            });
        }
    }
    resaltarCamposVacios();
    if (!error) {
        registrarCertificacion();
    }

}

function resaltarCamposVacios() {
    // Nombre de la certificación 
    if (inputNombre.value.trim() === "") {
        inputNombre.classList.add("input-error");
    } else {
        inputNombre.classList.remove("input-error");
    }

    // Institución 
    if (inputInstitucion.value.trim() === "") {
        inputInstitucion.classList.add("input-error");
    } else {
        inputInstitucion.classList.remove("input-error");
    }
}

function mostrarFechaExpiracion() {
    if (chkExpira.checked) {
        contenedorFecha.classList.remove("d-none");
        inputFechaVigencia.required = true;
        inputFechaVigencia.setAttribute("aria-required", "true");
        // Cargar la fecha actual solo si el campo está vacío (2026-07-15T01:35:42.518Z)
        if (!inputFechaVigencia.value) {
            inputFechaVigencia.value = new Date().toISOString().split("T")[0];
        }
    } else {
        contenedorFecha.classList.add("d-none");
        inputFechaVigencia.required = false;
        inputFechaVigencia.removeAttribute("aria-required");
        inputFechaVigencia.value = "";
    }
}

/*
http://localhost:3000/certificaciones
{
"nombre": "Python",
"institucion": "CENFOTEC"
} 

{
  "nombre": "Buenas prácticas de ciberseguridad",
  "institucion": "Empresa X", 
  "vigencia": {
  "expira": true, 
  "fechaExpiracion": "2028-06-30"
  }
}

*/

async function registrarCertificacion() {
    const datosCertificacion = {
        nombre: inputNombre.value,
        institucion: inputInstitucion.value,
        descripcion: inputDescripcion.value,
        vigencia: {
            expira: chkExpira.checked,
            fechaExpiracion: chkExpira.checked ? inputFechaVigencia.value : null
        } // fechaExpiracion: chkExpira.checked ? inputFechaVigencia.value : null  -> if (chkExpira.checked) tomar la fecha del input, else: asignar null
    };
    fetch("http://localhost:3000/certificaciones", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosCertificacion)
    }).then(response => {
        if (!response.ok) {
            Swal.fire({
                icon: "error",
                title: "No se pudo registrar la certificación",
                text: "Ocurrió un error al registrar la certificación.",
                confirmButtonText: "Aceptar"
            });

        } else {
            Swal.fire({
                icon: "success",
                title: "Certificación registrada correctamente",
                text: "La certificación fue almacenada exitosamente.",
                confirmButtonText: "Aceptar"
            });
            formulario.reset(); // Limpiar formulario
            mostrarFechaExpiracion();
        }

    }).catch(error => {
        Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "No fue posible comunicarse con el servidor.",
            confirmButtonText: "Aceptar"
        });

    });

}

btnGuardarCertificacion.addEventListener("click", validar);
chkExpira.addEventListener("change", mostrarFechaExpiracion);
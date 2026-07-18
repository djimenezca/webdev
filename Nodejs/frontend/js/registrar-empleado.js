const inputNombre = document.getElementById("txtNombre");
const inputCorreo = document.getElementById("txtCorreo");
const inputContrasenia = document.getElementById("txtContrasenia");
const inputProvincia = document.getElementById("txtProvincia");
const inputCanton = document.getElementById("txtCanton");
const inputDistrito = document.getElementById("txtDistrito");
const inputUbicacion = document.getElementById("txtUbicacion");

const btnRegistrarColaborador = document.querySelector("#btnRegistrarEmpleado");
const inputRequeridos = document.querySelectorAll("input[required]");

//ToDo: Hacer las validaciones

async function registrarColaborador() {
    const datosColaborador = {
        nombre: inputNombre.value,
        correo: inputCorreo.value,
        contrasenia: inputContrasenia.value,
        direccion: {
            provincia: inputProvincia.value,
            distrito: inputDistrito.value,
            canton: inputCanton.value, 
        }
    };
    fetch("http://localhost:3000/empleados", {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(datosColaborador)
    }).then(response => {
        if(!response.ok){
            // ToDo: Indicar el mensaje de error  
            Swal.fire({
                icon: "error",
                title: "No se puede registrar el colaborador",
                text: response,
                confirmButtonText: "Aceptar"
            });
        } else{
            Swal.fire({
                icon: "success",
                title: "Colaborador registrado correctamente",
                text: response,
                confirmButtonText: "Aceptar"
            });

            // ToDo: Limpiar el formulario 
        }
    }).catch(error => {
        // ToDo: Manejo de errores
        console.log(error);
    });
}


btnRegistrarColaborador.addEventListener("click", registrarColaborador);
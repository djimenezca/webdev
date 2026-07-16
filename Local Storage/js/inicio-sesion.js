const contrasennia = document.getElementById("contrasenna");
const correo = document.getElementById("correo");

const btnIniciarSesion = document.getElementById("iniciar-sesion");

/* 
Recuperar datos de LS: 
    1. Recuperar la información
        const usuarioGuardado = localStorage.getItem("usuario");
    2. Convertir nuevamente a objeto
        const usuario = JSON.parse(usuarioGuardado);


Eliminar los datos de LS: localStorage.removeItem("usuario");

Eliminar todos los datos almacenados por el sitio: localStorage.clear();
*/
function iniciarSesion(){
    // Verificar las credencias con la BD o recuperar los datos de LS

    // Recuperar los usuarios 
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Buscar un usuario con ese correo
    let existe = false;

    for(let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].correo === correo.value) {
            existe = true;
            Swal.fire({
                title: "Bienvenido (a)",
                text: usuarios[i].nombre,
                icon: "success",
                confirmButtonText: "Aceptar"
            });
            break; // Ya lo encontró, no necesita seguir buscando
        }
    }

    if (existe === false) {
        Swal.fire({
            title: "Error al iniciar sesión",
            text: "Datos de inicio de sesión incorrectos",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
    }
    
}

btnIniciarSesion.addEventListener("click", iniciarSesion);
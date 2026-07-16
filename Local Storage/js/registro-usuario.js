const correo = document.getElementById("correo");
const nombreUsuario = document.getElementById("nombre-usuario");
const contrasennia = document.getElementById("contrasenna");
const iconoContrasenna = document.getElementById("iconoContrasenna");

const btnRegistrarUsuario = document.getElementById("crear-cuenta");
const btnGuardarUsuarioLS = document.getElementById("guardar-usuario-ls");

const formulario = document.getElementById("formRegistro");

const btnMostrarContrasenna = document.getElementById("btnMostrarContrasenna");


function mostrarContrasenna(){
    if (contrasennia.type === "password") {

        contrasennia.type = "text";
        iconoContrasenna.classList.remove("fa-eye");
        iconoContrasenna.classList.add("fa-eye-slash");
        btnMostrarContrasenna.setAttribute("aria-label", "Ocultar contraseña");
        btnMostrarContrasenna.setAttribute("aria-pressed", "true");

    } else {
        contrasennia.type = "password";
        iconoContrasenna.classList.remove("fa-eye-slash");
        iconoContrasenna.classList.add("fa-eye");
        btnMostrarContrasenna.setAttribute("aria-label", "Mostrar contraseña");
        btnMostrarContrasenna.setAttribute("aria-pressed", "false");

    }
}

/* 
Local Storage (LS) es un mecanismo del navegador que permite almacenar información en forma de pares clave–valor. 

Los datos permanecen guardados incluso si el usuario cierra el navegador o apaga el equipo, hasta que se eliminen manualmente o mediante JavaScript: 
    1. Obtener los datos del formulario 
        const correo = document.getElementById("correo");
        const nombreUsuario = document.getElementById("nombre-usuario");

    2. Crear un objeto con la información a guardar en LS
        const usuario = {
            nombre: nombreUsuario.value,
            correo: correo.value
        };
    3. Convertir el objeto a texto y guardar la información
        localStorage.setItem("usuario", JSON.stringify(usuario));

Local Storage tendrá algo parecido a:
Clave: Valor
usuario: {"nombre":"Ana Mora","correo":"ana@correo.com"}

Nunca se debe guardar información sensible en Local Storage, ya que cualquier persona con acceso al navegador podría verla. 
*/

function crearCuenta(){
    // ToDo: Validar los datos

    // Enviar a la base de datos (BD los datos del usuario o guardar en LS)
    const usuario = {
        nombre: nombreUsuario.value,
        correo: correo.value
    }; // Crear el objeto con la información a guardar 

    localStorage.setItem("usuario", JSON.stringify(usuario));

    // Mostrar dato guardado en LS 
    const usuarioGuardadoLS = JSON.parse(localStorage.getItem("usuario"));

    if (usuario) {
        console.log(usuarioGuardadoLS.nombre);
        console.log(usuarioGuardadoLS.correo);
    }

}

function guardarUsuarioListaLS(){
    // Recuperar los usuarios si existen (para agregar el nuevo usuario a la lista)
    let usuarios = JSON.parse(localStorage.getItem("usuarios"));
    if (usuarios === null) { // Crear la lista de usuarios si no existen
        usuarios = [];
    }

    // Crear el nuevo usuario
    const nuevoUsuario = {
        nombre: nombreUsuario.value,
        correo: correo.value
    }; // Crear el objeto con la información a guardar 

    // Agregarlo al arreglo
    usuarios.push(nuevoUsuario);

    // Guardar la lista el LS
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Limpiar el formulario
    formulario.reset();

    // Mostrar todos los usuarios
    console.log("Lista de usuarios:");

    for(let i = 0; i < usuarios.length; i++){

        console.log("Usuario " + (i + 1));
        console.log("Nombre: " + usuarios[i].nombre);
        console.log("Correo: " + usuarios[i].correo);
        console.log("-------------------------");

    }
}




btnMostrarContrasenna.addEventListener("click", mostrarContrasenna);
btnRegistrarUsuario.addEventListener("click", crearCuenta);
btnGuardarUsuarioLS.addEventListener("click", guardarUsuarioListaLS);
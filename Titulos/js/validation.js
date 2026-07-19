/* ============================================================
   validation.js
   Patrones de expresiones regulares y utilidades de validación
   compartidas por los formularios de creación de registros.
   ============================================================ */

const Patterns = {
  // Nombre completo: solo letras (incl. tildes/ñ) y espacios, 2 a 60 caracteres
  nombre: /^[A-Za-zÁÉÍÓÚÑáéíóúñ]+(?:\s[A-Za-zÁÉÍÓÚÑáéíóúñ]+)+$/,

  // Cédula de identidad costarricense: 9 dígitos, con o sin guiones (1-2345-6789)
  cedula: /^\d{1}-?\d{4}-?\d{4}$/,

  // Correo institucional o personal
  correo: /^[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[A-Za-z]{2,}$/,

  // Teléfono costarricense: 8 dígitos, opcionalmente con +506 y espacio/guion
  telefono: /^(\+506\s?)?\d{4}-?\d{4}$/,

  // Año de graduación: cuatro dígitos entre 1980 y 2029
  anio: /^(19[89]\d|20[0-2]\d)$/,

  // Código de título: 2-4 letras, guion, 3-6 dígitos (ej. LIC-2026, BSC-00458)
  codigoTitulo: /^[A-Z]{2,4}-\d{3,6}$/,

  // Nombre de título / carrera: letras, números, espacios y algunos signos
  textoLibre: /^[\w ÁÉÍÓÚÑáéíóúñ.,()-]{3,80}$/,

  // Usuario de acceso (login): letras, números, punto y guion bajo, 4-24 caracteres
  usuario: /^[a-zA-Z0-9_.]{4,24}$/,

  // Contraseña: mínimo 8 caracteres, al menos una letra y un número
  contrasena: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
};

/**
 * Valida un valor contra un patrón y devuelve { valid, message }.
 * @param {string} value
 * @param {RegExp} pattern
 * @param {string} messageInvalid
 */
function validatePattern(value, pattern, messageInvalid) {
  const trimmed = (value || "").trim();
  if (trimmed === "") {
    return { valid: false, message: "Este campo es obligatorio." };
  }
  if (!pattern.test(trimmed)) {
    return { valid: false, message: messageInvalid };
  }
  return { valid: true, message: "" };
}

/**
 * Aplica validación a un <input>/<select> y actualiza las clases
 * .valid / .invalid del contenedor .field, junto con el mensaje de error.
 */
function applyFieldValidation(inputEl, pattern, messageInvalid) {
  const field = inputEl.closest(".field");
  const errorEl = field.querySelector(".error-msg");
  const result = validatePattern(inputEl.value, pattern, messageInvalid);

  field.classList.toggle("invalid", !result.valid);
  field.classList.toggle("valid", result.valid);
  if (errorEl) errorEl.textContent = result.valid ? "" : result.message;

  return result.valid;
}

/* Exponer en el ámbito global para uso desde main.js */
window.Patterns = Patterns;
window.validatePattern = validatePattern;
window.applyFieldValidation = applyFieldValidation;

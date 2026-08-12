/* ============================================================
   api.js
   Helpers compartidos para consumir la API REST del backend
   (fetch + async/await + manejo de errores con try/catch).
   ============================================================ */

const API_BASE_URL = "http://localhost:3000";

/**
 * Realiza una petición GET al endpoint indicado y devuelve el
 * arreglo de objetos que responde el servidor.
 * @param {string} endpoint p.ej. "/egresados"
 */
async function apiGet(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Error ${response.status} al consultar ${endpoint}.`);
  }
  return response.json();
}

/**
 * Realiza una petición POST al endpoint indicado con el objeto
 * JSON en el body, y devuelve el registro creado por el servidor.
 * @param {string} endpoint p.ej. "/egresados"
 * @param {object} data cuerpo JSON con la estructura que espera el servidor
 */
async function apiPost(endpoint, data) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const mensaje = body.mensajeError || body.msj || "Ocurrió un error al guardar el registro.";
    throw new Error(mensaje);
  }

  return body;
}

/* Exponer en el ámbito global para uso desde main.js */
window.API_BASE_URL = API_BASE_URL;
window.apiGet = apiGet;
window.apiPost = apiPost;

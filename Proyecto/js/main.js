/* ============================================================
   main.js
   Navegación, persistencia local (localStorage) y lógica de
   los formularios de creación + tablas de "Gestión de egresados"
   y "Gestión de títulos".
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initLoginForm();
  initPerfilPage();
});

/* ---------------- Navegación móvil ---------------- */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

/* ---------------- Utilidad de validación en vivo ---------------- */
function wireLiveValidation(fieldSpecs) {
  fieldSpecs.forEach(({ id, pattern, message }) => {
    const input = document.getElementById(id);
    if (!input) return;
    const handler = () => applyFieldValidation(input, pattern, message);
    input.addEventListener("blur", handler);
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("invalid")) handler();
    });
  });
}

function validateAll(fieldSpecs) {
  let allValid = true;
  fieldSpecs.forEach(({ id, pattern, message }) => {
    const input = document.getElementById(id);
    if (!input) return;
    const ok = applyFieldValidation(input, pattern, message);
    if (!ok) allValid = false;
  });
  return allValid;
}

/* ---------------- Login ---------------- */
function initLoginForm() {
  const form = document.getElementById("form-login");
  if (!form) return;

  const specs = [
    { id: "login-usuario", pattern: Patterns.usuario, message: "Use 4-24 caracteres: letras, números, punto o guion bajo." },
    { id: "login-clave", pattern: Patterns.contrasena, message: "Mínimo 8 caracteres, con al menos una letra y un número." },
  ];
  wireLiveValidation(specs);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const status = document.getElementById("login-status");
    if (validateAll(specs)) {
      status.textContent = "Credenciales con formato válido. Redirigiendo al perfil…";
      status.className = "form-status ok";
      setTimeout(() => (window.location.href = "perfil.html"), 700);
    } else {
      status.textContent = "Revise los campos marcados en rojo.";
      status.className = "form-status err";
    }
  });
}

/* Nota: la lógica de "Gestión de egresados" vive en js/egresados.js
   y la de "Gestión de títulos" en js/titulos.js (cada una a cargo de
   un integrante distinto del equipo), para mantener commits e
   historial de Git independientes por persona. */

/* ---------------- Perfil de egresado ---------------- */
/* Página compartida: consulta el egresado por su _id (GET /egresados)
   y sus títulos asociados (GET /titulos), ya que el backend no expone
   un endpoint individual por id — se filtra sobre el arreglo completo. */
async function initPerfilPage() {
  const container = document.getElementById("perfil-detalle");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  document.getElementById("perfil-nombre").textContent = "Cargando…";
  container.innerHTML = "<dt>Cargando datos…</dt><dd></dd>";

  try {
    const [egresados, titulos] = await Promise.all([apiGet("/egresados"), apiGet("/titulos")]);
    const egresado = egresados.find((e) => e._id === id) || egresados[0];

    if (!egresado) {
      document.getElementById("perfil-nombre").textContent = "Sin egresados registrados";
      container.innerHTML = "<dt>—</dt><dd>Registre un egresado primero en Gestión de egresados.</dd>";
      return;
    }

    const susTitulos = titulos.filter((t) => t.egresado && t.egresado._id === egresado._id);

    document.getElementById("perfil-nombre").textContent = egresado.nombreCompleto;
    document.getElementById("perfil-cedula").textContent = egresado.identificacion;

    container.innerHTML = `
      <dt>Correo</dt><dd>${escapeHtml(egresado.correoElectronico)}</dd>
      <dt>Teléfono</dt><dd>${escapeHtml(egresado.telefono)}</dd>
      <dt>Área profesional</dt><dd>${escapeHtml(egresado.areaProfesional || "—")}</dd>
    `;

    const titulosList = document.getElementById("perfil-titulos");
    if (titulosList) {
      titulosList.innerHTML = susTitulos.length
        ? susTitulos
            .map(
              (t) => `<li><span class="sello" aria-hidden="true"><span>${escapeHtml(t.tipoPrograma[0])}</span></span> <div><strong>${escapeHtml(t.tipoPrograma)}</strong><br><span class="hint">${escapeHtml(t.carrera ? t.carrera.nombre : "—")} · ${escapeHtml(String(t.annoGraduacion))}</span></div></li>`
            )
            .join("")
        : "<li>Sin títulos registrados todavía.</li>";
    }
  } catch (error) {
    document.getElementById("perfil-nombre").textContent = "Error al cargar el perfil";
    container.innerHTML = `<dt>—</dt><dd>No se pudo conectar con el servidor (${API_BASE_URL}).</dd>`;
  }
}

/* ---------------- Utilidad ---------------- */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function formatCedula(value) {
  const d = value.replace(/\D/g, "").slice(0, 9); // deja solo dígitos, máx 9
  let out = d.slice(0, 1);
  if (d.length > 1) out += "-" + d.slice(1, 5);
  if (d.length > 5) out += "-" + d.slice(5, 9);
  return out;
}

function formatTelefono(value) {
  const d = value.replace(/\D/g, "").slice(0, 8); // solo dígitos, máx 8
  let out = d.slice(0, 4);
  if (d.length > 4) out += "-" + d.slice(4, 8);
  return out;
}
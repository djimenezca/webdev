/* ============================================================
   main.js
   Navegación, persistencia local (localStorage) y lógica de
   los formularios de creación + tablas de "Gestión de egresados"
   y "Gestión de títulos".
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initLoginForm();
  initEgresadosPage();
  initTitulosPage();
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

/* ---------------- Almacenamiento (simula backend) ---------------- */
const Store = {
  read(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
      return [];
    }
  },
  write(key, arr) {
    localStorage.setItem(key, JSON.stringify(arr));
  },
  add(key, record) {
    const arr = Store.read(key);
    arr.push(record);
    Store.write(key, arr);
    return arr;
  },
  seedIfEmpty(key, seed) {
    if (Store.read(key).length === 0) Store.write(key, seed);
  },
};

const SEED_EGRESADOS = [
  { cedula: "1-1234-5678", nombre: "Mariana Solís Vargas", correo: "mariana.solis@cenfotec.ejemplo", telefono: "8888-1234", carrera: "Ingeniería de Software", anio: "2023", estado: "activo" },
  { cedula: "2-0456-0789", nombre: "Kevin Araya Rojas", correo: "kevin.araya@cenfotec.ejemplo", telefono: "7070-4455", carrera: "Ingeniería en TI", anio: "2021", estado: "inactivo" },
];

const SEED_TITULOS = [
  { codigo: "BSC-00458", nombre: "Bachillerato en Ingeniería de Software", tipoNivel: "Grado", cedulaEgresado: "1-1234-5678", fechaEmision: "2023-12-01" },
  { codigo: "LIC-2019", nombre: "Licenciatura en Ingeniería en TI", tipoNivel: "Posgrado", cedulaEgresado: "2-0456-0789", fechaEmision: "2021-06-15" },
];

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

/* ---------------- Gestión de egresados ---------------- */
function initEgresadosPage() {
  const form = document.getElementById("form-egresado");
  const tbody = document.getElementById("tabla-egresados-body");
  if (!form && !tbody) return;

  Store.seedIfEmpty("egresados", SEED_EGRESADOS);
  const cedulaInput = document.getElementById("eg-cedula");
  if (cedulaInput) {
    cedulaInput.addEventListener("input", () => {
      cedulaInput.value = formatCedula(cedulaInput.value);
    });
  }

  const telInput = document.getElementById("eg-telefono");
  if (telInput) {
    telInput.addEventListener("input", () => {
      telInput.value = formatTelefono(telInput.value);
    });
  }

  const specs = [
    { id: "eg-cedula", pattern: Patterns.cedula, message: "Formato esperado: 1-2345-6789." },
    { id: "eg-nombre", pattern: Patterns.nombre, message: "Ingrese nombre y apellidos, solo letras." },
    { id: "eg-correo", pattern: Patterns.correo, message: "Ingrese un correo válido (usuario@dominio.com)." },
    { id: "eg-telefono", pattern: Patterns.telefono, message: "Formato esperado: 8888-1234." },
    { id: "eg-carrera", pattern: Patterns.textoLibre, message: "Ingrese el nombre de la carrera (3-80 caracteres)." },
    { id: "eg-anio", pattern: Patterns.anio, message: "Ingrese un año entre 1980 y 2029." },
  ];

  if (tbody) renderEgresadosTable(tbody);

  if (form) {
    wireLiveValidation(specs);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = document.getElementById("eg-status");
      if (!validateAll(specs)) {
        status.textContent = "Corrija los campos marcados antes de continuar.";
        status.className = "form-status err";
        return;
      }
      const record = {
        cedula: document.getElementById("eg-cedula").value.trim(),
        nombre: document.getElementById("eg-nombre").value.trim(),
        correo: document.getElementById("eg-correo").value.trim(),
        telefono: document.getElementById("eg-telefono").value.trim(),
        carrera: document.getElementById("eg-carrera").value.trim(),
        anio: document.getElementById("eg-anio").value.trim(),
        estado: document.getElementById("eg-estado").value,
      };
      Store.add("egresados", record);
      status.textContent = `Egresado ${record.nombre} registrado correctamente.`;
      status.className = "form-status ok";
      form.reset();
      form.querySelectorAll(".field").forEach((f) => f.classList.remove("valid", "invalid"));
      if (tbody) renderEgresadosTable(tbody);
    });
  }
}

function renderEgresadosTable(tbody) {
  const rows = Store.read("egresados");
  tbody.innerHTML = rows
    .map(
      (r) => `
    <tr>
      <td>${escapeHtml(r.cedula)}</td>
      <td>${escapeHtml(r.nombre)}</td>
      <td>${escapeHtml(r.carrera)}</td>
      <td>${escapeHtml(r.anio)}</td>
      <td><span class="badge ${r.estado}">${r.estado}</span></td>
      <td><a class="btn btn-ghost btn-sm" href="perfil.html?cedula=${encodeURIComponent(r.cedula)}">Ver perfil</a></td>
    </tr>`
    )
    .join("");
}

/* ---------------- Gestión de títulos ---------------- */
function initTitulosPage() {
  const form = document.getElementById("form-titulo");
  const tbody = document.getElementById("tabla-titulos-body");
  const selectEgresado = document.getElementById("tit-egresado");
  if (!form && !tbody) return;

  Store.seedIfEmpty("egresados", SEED_EGRESADOS);
  Store.seedIfEmpty("titulos", SEED_TITULOS);

  if (selectEgresado) {
    const egresados = Store.read("egresados");
    selectEgresado.innerHTML =
      '<option value="">Seleccione un egresado…</option>' +
      egresados.map((e) => `<option value="${escapeHtml(e.cedula)}">${escapeHtml(e.nombre)} — ${escapeHtml(e.cedula)}</option>`).join("");
  }

  const specs = [
    { id: "tit-codigo", pattern: Patterns.codigoTitulo, message: "Formato esperado: LIC-2026 o BSC-00458." },
    { id: "tit-nombre", pattern: Patterns.textoLibre, message: "Ingrese el nombre del título (3-80 caracteres)." },
  ];

  if (tbody) renderTitulosTable(tbody);

  if (form) {
    wireLiveValidation(specs);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = document.getElementById("tit-status");
      const egresadoField = document.getElementById("tit-egresado");
      const egresadoValido = egresadoField.value !== "";
      egresadoField.closest(".field").classList.toggle("invalid", !egresadoValido);
      egresadoField.closest(".field").classList.toggle("valid", egresadoValido);

      const camposOk = validateAll(specs);
      if (!camposOk || !egresadoValido) {
        status.textContent = "Corrija los campos marcados antes de continuar.";
        status.className = "form-status err";
        return;
      }
      const record = {
        codigo: document.getElementById("tit-codigo").value.trim(),
        nombre: document.getElementById("tit-nombre").value.trim(),
        tipoNivel: document.getElementById("tit-nivel").value,
        cedulaEgresado: egresadoField.value,
        fechaEmision: document.getElementById("tit-fecha").value,
      };
      Store.add("titulos", record);
      status.textContent = `Título ${record.codigo} registrado correctamente.`;
      status.className = "form-status ok";
      form.reset();
      form.querySelectorAll(".field").forEach((f) => f.classList.remove("valid", "invalid"));
      if (tbody) renderTitulosTable(tbody);
    });
  }
}

function renderTitulosTable(tbody) {
  const titulos = Store.read("titulos");
  const egresados = Store.read("egresados");
  tbody.innerHTML = titulos
    .map((t) => {
      const eg = egresados.find((e) => e.cedula === t.cedulaEgresado);
      return `
    <tr>
      <td>${escapeHtml(t.codigo)}</td>
      <td>${escapeHtml(t.nombre)}</td>
      <td>${escapeHtml(t.tipoNivel)}</td>
      <td>${eg ? escapeHtml(eg.nombre) : "—"}</td>
      <td>${escapeHtml(t.fechaEmision || "—")}</td>
    </tr>`;
    })
    .join("");
}

/* ---------------- Perfil de egresado ---------------- */
function initPerfilPage() {
  const container = document.getElementById("perfil-detalle");
  if (!container) return;

  Store.seedIfEmpty("egresados", SEED_EGRESADOS);
  Store.seedIfEmpty("titulos", SEED_TITULOS);

  const params = new URLSearchParams(window.location.search);
  const cedula = params.get("cedula");
  const egresados = Store.read("egresados");
  const titulos = Store.read("titulos");

  const egresado = egresados.find((e) => e.cedula === cedula) || egresados[0];
  if (!egresado) return;

  const susTitulos = titulos.filter((t) => t.cedulaEgresado === egresado.cedula);

  document.getElementById("perfil-nombre").textContent = egresado.nombre;
  document.getElementById("perfil-cedula").textContent = egresado.cedula;

  container.innerHTML = `
    <dt>Correo</dt><dd>${escapeHtml(egresado.correo)}</dd>
    <dt>Teléfono</dt><dd>${escapeHtml(egresado.telefono)}</dd>
    <dt>Carrera</dt><dd>${escapeHtml(egresado.carrera)}</dd>
    <dt>Año de graduación</dt><dd>${escapeHtml(egresado.anio)}</dd>
    <dt>Estado</dt><dd><span class="badge ${egresado.estado}">${egresado.estado}</span></dd>
  `;

  const titulosList = document.getElementById("perfil-titulos");
  if (titulosList) {
    titulosList.innerHTML = susTitulos.length
      ? susTitulos.map((t) => `<li><span class="sello" aria-hidden="true"><span>${escapeHtml(t.tipoNivel[0])}</span></span> <div><strong>${escapeHtml(t.nombre)}</strong><br><span class="hint">${escapeHtml(t.codigo)} · ${escapeHtml(t.fechaEmision)}</span></div></li>`).join("")
      : "<li>Sin títulos registrados todavía.</li>";
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
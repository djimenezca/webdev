/* ============================================================
   egresados.js
   Gestión de egresados — Djorkaeff Jiménez Carballo.
   Conectado a la API REST del backend (colección /egresados).
   GET se ejecuta al cargar la página y después de cada POST
   exitoso, para reflejar de inmediato el nuevo registro sin
   necesidad de recargar la página.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initEgresadosPage();
});

function initEgresadosPage() {
  const form = document.getElementById("form-egresado");
  const tbody = document.getElementById("tabla-egresados-body");
  if (!form && !tbody) return;

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
  ];

  // Consulta inicial (GET) para mostrar los datos existentes desde el inicio.
  if (tbody) cargarEgresados(tbody);

  if (form) {
    wireLiveValidation(specs);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = document.getElementById("eg-status");

      if (!validateAll(specs)) {
        status.textContent = "Corrija los campos marcados antes de continuar.";
        status.className = "form-status err";
        return;
      }

      // Estructura exacta que espera el servidor (ver Anexo 1 de la consigna).
      const payload = {
        identificacion: document.getElementById("eg-cedula").value.trim(),
        nombreCompleto: document.getElementById("eg-nombre").value.trim(),
        correoElectronico: document.getElementById("eg-correo").value.trim(),
        telefono: document.getElementById("eg-telefono").value.trim(),
      };
      const areaInput = document.getElementById("eg-area");
      const areaProfesional = areaInput ? areaInput.value.trim() : "";
      if (areaProfesional) payload.areaProfesional = areaProfesional;

      status.textContent = "Guardando…";
      status.className = "form-status";

      try {
        await apiPost("/egresados", payload);
        status.textContent = `Egresado ${payload.nombreCompleto} registrado correctamente.`;
        status.className = "form-status ok";
        form.reset();
        form.querySelectorAll(".field").forEach((f) => f.classList.remove("valid", "invalid"));
        // Tras un POST exitoso se vuelve a invocar el GET para refrescar la vista.
        if (tbody) await cargarEgresados(tbody);
      } catch (error) {
        status.textContent = error.message || "No se pudo registrar el egresado. Intente de nuevo.";
        status.className = "form-status err";
      }
    });
  }
}

async function cargarEgresados(tbody) {
  tbody.innerHTML = `<tr><td colspan="5">Cargando egresados…</td></tr>`;
  try {
    const egresados = await apiGet("/egresados");
    renderEgresadosTable(tbody, egresados);
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="5">No se pudo conectar con el servidor (${API_BASE_URL}). Verifique que la API esté corriendo.</td></tr>`;
  }
}

function renderEgresadosTable(tbody, egresados) {
  if (!egresados.length) {
    tbody.innerHTML = `<tr><td colspan="5">Aún no hay egresados registrados.</td></tr>`;
    return;
  }
  tbody.innerHTML = egresados
    .map(
      (r) => `
    <tr>
      <td>${escapeHtml(r.identificacion)}</td>
      <td>${escapeHtml(r.nombreCompleto)}</td>
      <td>${escapeHtml(r.correoElectronico)}</td>
      <td>${escapeHtml(r.areaProfesional || "—")}</td>
      <td><a class="btn btn-ghost btn-sm" href="perfil.html?id=${encodeURIComponent(r._id)}">Ver perfil</a></td>
    </tr>`
    )
    .join("");
}

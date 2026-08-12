/* ============================================================
   titulos.js
   Gestión de títulos — Jennifer Marín Sibaja.
   Conectado a la API REST del backend (colección /titulos).
   Los selects de carrera, escuela y egresado se pueblan por GET
   a sus respectivos endpoints, ya que /titulos exige IDs válidos
   de esas colecciones. GET /titulos se ejecuta al cargar la
   página y después de cada POST exitoso.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initTitulosPage();
});

function initTitulosPage() {
  const form = document.getElementById("form-titulo");
  const tbody = document.getElementById("tabla-titulos-body");
  if (!form && !tbody) return;

  const selectCarrera = document.getElementById("tit-carrera");
  const selectEscuela = document.getElementById("tit-escuela");
  const selectEgresado = document.getElementById("tit-egresado");

  if (selectCarrera || selectEscuela || selectEgresado) {
    cargarSelectsTitulo(selectCarrera, selectEscuela, selectEgresado);
  }

  const specs = [
    { id: "tit-anno", pattern: Patterns.anio, message: "Ingrese un año entre 1980 y 2029." },
  ];

  // Consulta inicial (GET) para mostrar los datos existentes desde el inicio.
  if (tbody) cargarTitulos(tbody);

  if (form) {
    wireLiveValidation(specs);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = document.getElementById("tit-status");

      const selects = [selectCarrera, selectEscuela, selectEgresado];
      const selectsValidos = selects.every((s) => s && s.value !== "");
      selects.forEach((s) => {
        if (!s) return;
        s.closest(".field").classList.toggle("invalid", s.value === "");
        s.closest(".field").classList.toggle("valid", s.value !== "");
      });

      const camposOk = validateAll(specs);
      if (!camposOk || !selectsValidos) {
        status.textContent = "Corrija los campos marcados antes de continuar.";
        status.className = "form-status err";
        return;
      }

      // Estructura exacta que espera el servidor (ver Anexo 1 de la consigna).
      const payload = {
        tipoPrograma: document.getElementById("tit-tipoPrograma").value,
        carrera: selectCarrera.value,
        escuela: selectEscuela.value,
        annoGraduacion: Number(document.getElementById("tit-anno").value.trim()),
        egresado: selectEgresado.value,
        estado: document.getElementById("tit-estado").value,
      };

      status.textContent = "Guardando…";
      status.className = "form-status";

      try {
        await apiPost("/titulos", payload);
        status.textContent = "Título registrado correctamente.";
        status.className = "form-status ok";
        form.reset();
        form.querySelectorAll(".field").forEach((f) => f.classList.remove("valid", "invalid"));
        // Tras un POST exitoso se vuelve a invocar el GET para refrescar la vista.
        if (tbody) await cargarTitulos(tbody);
      } catch (error) {
        status.textContent = error.message || "No se pudo registrar el título. Intente de nuevo.";
        status.className = "form-status err";
      }
    });
  }
}

async function cargarSelectsTitulo(selectCarrera, selectEscuela, selectEgresado) {
  try {
    const [carreras, escuelas, egresados] = await Promise.all([
      apiGet("/carreras"),
      apiGet("/escuelas"),
      apiGet("/egresados"),
    ]);

    if (selectCarrera) {
      selectCarrera.innerHTML = carreras.length
        ? '<option value="">Seleccione una carrera…</option>' +
          carreras.map((c) => `<option value="${c._id}">${escapeHtml(c.nombre)}</option>`).join("")
        : '<option value="">No hay carreras registradas todavía</option>';
    }
    if (selectEscuela) {
      selectEscuela.innerHTML = escuelas.length
        ? '<option value="">Seleccione una escuela…</option>' +
          escuelas.map((e) => `<option value="${e._id}">${escapeHtml(e.nombre)}</option>`).join("")
        : '<option value="">No hay escuelas registradas todavía</option>';
    }
    if (selectEgresado) {
      selectEgresado.innerHTML = egresados.length
        ? '<option value="">Seleccione un egresado…</option>' +
          egresados.map((eg) => `<option value="${eg._id}">${escapeHtml(eg.nombreCompleto)} — ${escapeHtml(eg.identificacion)}</option>`).join("")
        : '<option value="">No hay egresados registrados todavía</option>';
    }
  } catch (error) {
    [selectCarrera, selectEscuela, selectEgresado].forEach((s) => {
      if (s) s.innerHTML = '<option value="">Error al cargar datos del servidor</option>';
    });
  }
}

async function cargarTitulos(tbody) {
  tbody.innerHTML = `<tr><td colspan="6">Cargando títulos…</td></tr>`;
  try {
    const titulos = await apiGet("/titulos");
    renderTitulosTable(tbody, titulos);
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="6">No se pudo conectar con el servidor (${API_BASE_URL}). Verifique que la API esté corriendo.</td></tr>`;
  }
}

function renderTitulosTable(tbody, titulos) {
  if (!titulos.length) {
    tbody.innerHTML = `<tr><td colspan="6">Aún no hay títulos registrados.</td></tr>`;
    return;
  }
  tbody.innerHTML = titulos
    .map(
      (t) => `
    <tr>
      <td>${escapeHtml(t.tipoPrograma)}</td>
      <td>${t.carrera ? escapeHtml(t.carrera.nombre) : "—"}</td>
      <td>${t.escuela ? escapeHtml(t.escuela.nombre) : "—"}</td>
      <td>${escapeHtml(String(t.annoGraduacion))}</td>
      <td>${t.egresado ? escapeHtml(t.egresado.nombreCompleto) : "—"}</td>
      <td><span class="badge">${escapeHtml(t.estado)}</span></td>
    </tr>`
    )
    .join("");
}

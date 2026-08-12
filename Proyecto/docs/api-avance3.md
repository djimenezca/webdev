# Integración con la API REST · Avance III

## 1. Levantar el backend localmente

```bash
cd Proyecto/backend
npm install
cp .env.example .env   # y completar MONGODB_URI con las credenciales reales (no se sube a git)
node index.js
```

El servidor queda escuchando en `http://localhost:3000`.

## 2. Entidades trabajadas por el equipo

| Integrante | Entidad | Endpoint | Página |
|---|---|---|---|
| Djorkaeff Jiménez Carballo | Egresados | `POST/GET /egresados` | `egresados.html` |
| Jennifer Marín Sibaja | Títulos | `POST/GET /titulos` | `titulos.html` |

Ambos usan `fetch` + `async/await` + `try/catch`, definidos en `js/api.js`
(`apiGet`, `apiPost`) y consumidos desde `js/main.js`.

## 3. Datos previos necesarios para "Gestión de títulos"

El modelo `Titulo` exige un `carrera` (ID) y una `escuela` (ID) ya existentes.
Como el alcance del equipo (2 personas) no incluye una pantalla para crear
carreras ni escuelas, hay que sembrar al menos un registro de cada una antes
de la demo, con el backend corriendo:

```bash
curl -X POST http://localhost:3000/carreras \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ingeniería de Software","descripcion":"Diseño y desarrollo de software"}'

curl -X POST http://localhost:3000/escuelas \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Escuela de Ingeniería del Software","descripcion":"Departamento de ingeniería"}'
```

Con esos registros creados, los `<select>` de Carrera y Escuela en
`titulos.html` se llenan automáticamente vía `GET /carreras` y `GET /escuelas`.

## 4. Flujo GET/POST implementado

- Al cargar `egresados.html` o `titulos.html`, se ejecuta un `GET` que llena
  la tabla con los registros existentes en el servidor.
- Al enviar el formulario, se ejecuta un `POST` con el body exacto que
  espera el servidor (ver Anexo 1 de la consigna). Si la respuesta es
  exitosa: se limpia el formulario, se muestra un mensaje de éxito y se
  vuelve a ejecutar el `GET` para refrescar la tabla sin recargar la página.
  Si falla, se muestra el mensaje de error que devuelve el servidor.

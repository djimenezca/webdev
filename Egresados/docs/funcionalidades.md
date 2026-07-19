# Funcionalidades del sistema · Portal de Egresados CENFOTEC

Documento de referencia de las funcionalidades implementadas en el Avance II.

## Validación de formularios (JavaScript + expresiones regulares)
Antes de guardar, cada formulario valida los datos con expresiones regulares
definidas en `js/validation.js`:

- **Cédula:** formato `1-2345-6789`.
- **Nombre:** solo letras y espacios (nombre y apellidos).
- **Correo:** formato `usuario@dominio.com` (acepta subdominios).
- **Teléfono:** 8 dígitos, formato `8888-1234`.
- **Año de graduación:** entre 1980 y 2029.
- **Código de título:** por ejemplo `LIC-2026` o `BSC-00458`.

Si un campo está vacío o con formato incorrecto, se muestra un mensaje de error
claro debajo del campo y no se guarda el registro.

## Almacenamiento (Local Storage)
Los registros se guardan en el navegador usando una lista (arreglo) de objetos,
de modo que se pueden registrar varios elementos sin sobrescribir los anteriores.
Se implementa en el objeto `Store` de `js/main.js`.

## Gestión de registros (crear, editar y eliminar)
Tanto en **Gestión de egresados** como en **Gestión de títulos**:

- **Crear:** el formulario valida y agrega el registro a la lista.
- **Editar:** el botón *Editar* carga los datos en el formulario; al guardar,
  se actualiza el registro existente.
- **Eliminar:** el botón *Eliminar* pide confirmación y borra el registro.

## Verificación
Después de cada registro, la lista completa almacenada se muestra en la consola
del navegador (F12 → Console) para comprobar que el proceso fue correcto.

## Limpieza del formulario
Al guardar correctamente, el formulario se limpia y queda listo para un nuevo registro.
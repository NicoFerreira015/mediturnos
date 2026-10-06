# Integración de consumo GET – MediTurnos

## 3.1 Identificación de datos simulados

Para esta etapa se utilizan datos simulados provenientes de una API pública de prueba. La fuente utilizada es JSONPlaceholder, mediante el recurso `/users`.

Los datos seleccionados para la demostración son:

- `id`: identificador del registro.
- `name`: nombre del paciente simulado.
- `email`: correo electrónico.
- `phone`: teléfono.
- `address.city`: ciudad.

Estos datos son únicamente de demostración y no sustituyen todavía los datos propios del sistema MediTurnos.

## 3.2 Definición del consumo

La operación seleccionada corresponde a una consulta de registros simulados.

1. **Información solicitada:** identificador, nombre, correo, teléfono y ciudad de los registros simulados.
2. **Endpoint utilizado en la práctica:** `GET https://jsonplaceholder.typicode.com/users`
3. **Estructura JSON esperada:**

```json
{
  "id": 1,
  "name": "Leanne Graham",
  "email": "Sincere@april.biz",
  "phone": "1-770-736-8031",
  "address": {
    "city": "Gwenborough"
  }
}
```

4. **Pantalla donde se muestran:** pantalla **Gestión de Pacientes**, en una sección independiente denominada **Pacientes obtenidos desde una API de prueba**.

## 3.3 Implementación de GET con fetch()

La solicitud se realiza desde el componente de pacientes mediante `fetch()`:

```javascript
const response = await fetch(
    "https://jsonplaceholder.typicode.com/users"
);

if (!response.ok) {
    throw new Error(
        "No fue posible obtener los datos."
    );
}

const data = await response.json();

setDatosSimulados(
    data.slice(0, 5)
);
```

La respuesta no se limita a mostrarse en consola. Los registros obtenidos se almacenan en el estado `datosSimulados` y posteriormente se presentan en una tabla.

## 3.4 Visualización de los datos

Los datos recibidos se muestran en una tabla dentro de la pantalla de Gestión de Pacientes.

La tabla presenta:

- ID.
- Paciente simulado.
- Correo.
- Teléfono.
- Ciudad.

Se muestran cinco registros para mantener la demostración clara y evitar sobrecargar la interfaz.

## 3.5 Manejo básico de estados

La interfaz contempla tres estados:

### Carga

Mientras se ejecuta la solicitud GET se muestra:

> Obteniendo datos simulados...

### Éxito

Cuando la solicitud finaliza correctamente, se muestra la tabla con los registros recibidos y el indicador:

> Consulta exitosa

### Error

Si la solicitud falla o la respuesta no es válida, se muestra un mensaje indicando que los datos no pudieron cargarse.

## 3.6 Identificación de una futura operación POST

El formulario existente de **Nuevo paciente** será la base para una futura operación POST.

| Formulario | Datos a enviar | Operación futura |
|---|---|---|
| Nuevo paciente | Nombre, cédula, teléfono, correo, fecha de nacimiento y dirección | `POST /pacientes` |

En esta etapa no se implementa todavía el endpoint propio. El formulario continúa funcionando con el almacenamiento local del MVP.

## 3.7 Relación con la arquitectura futura

La demostración representa el primer paso de la integración entre frontend y servicios.

```text
FRONTEND
Next.js + React
      │
      │ fetch()
      ▼
API / BACKEND
      │
      ▼
BASE DE DATOS
PostgreSQL
```

Actualmente el `fetch()` utiliza una API externa de prueba. En etapas posteriores, el endpoint externo será reemplazado por el backend propio del proyecto.

La arquitectura objetivo será:

```text
Next.js / React
      │
      │ fetch()
      ▼
API / Backend propio
      │
      │ Prisma ORM
      ▼
PostgreSQL
```

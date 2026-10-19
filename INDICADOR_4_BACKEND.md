# MediTurnos - Indicador 4: Backend inicial y endpoints propios

## Tecnologias
- Frontend: Next.js + React + Tailwind CSS.
- Backend: Next.js App Router Route Handlers (API REST en el mismo repositorio).
- Datos: arreglo temporal EN MEMORIA (`lib/turnos-server.js`).
- Base de datos futura (segun Indicador 1): PostgreSQL + Prisma. **No se incorpora en este indicador**.

## Ejecutar
1. Instalar Node.js compatible con Next.js 16 (Node >=20.9).
2. Abrir terminal en la carpeta del proyecto.
3. Ejecutar `npm install` (o `npm ci`) y luego `npm run dev`.
4. Abrir `http://localhost:3000`.
5. Ir a Turnos y Nuevo turno. La pantalla de Turnos y el dashboard consultan `GET /api/turnos`; el formulario envía `POST /api/turnos`.

**IMPORTANTE:** Reiniciar el servidor restablece los turnos iniciales. Esta memoria tampoco garantiza consistencia entre instancias/serverless (como Vercel). Hacer la demostracion **localmente**, manteniendo un solo proceso de Next.js. Los pacientes aun se guardan en localStorage como en el MVP original. Las citas anteriores guardadas en localStorage no se migran automaticamente a la memoria del servidor.

## Tabla de endpoints
| Metodo | Ruta | Proposito | Respuestas |
|---|---|---|---|
| GET | `/api/turnos` | Consultar turnos registrados | 200 JSON |
| POST | `/api/turnos` | Crear un turno | 201 JSON; 400 campos incorrectos; 409 horario ocupado |
| GET | `/api/turnos/{id}` | Consultar turno por ID (extra) | 200; 404 |
| PATCH | `/api/turnos/{id}` | Cambiar estado (extra, mantiene RF05) | 200; 400; 404; 409 |

## Ejemplos para pruebas y capturas
GET desde navegador o Postman: `http://localhost:3000/api/turnos`.

POST a `http://localhost:3000/api/turnos` con header `Content-Type: application/json`:

```json
{
  "pacienteId": 1,
  "paciente": "Lucía Fernández Ortiz",
  "profesionalId": 1,
  "profesional": "Dr. Molina",
  "especialidad": "Clínica Médica",
  "fecha": "2026-11-20",
  "hora": "08:30"
}
```
Respuesta esperada: HTTP 201, objeto `turno` con `id` y `estado: "Pendiente"`.

POST inválido: `{ "paciente": "" }`. Respuesta esperada: HTTP 400 y `error` describiendo datos obligatorios.

POST duplicado: repetir el POST anterior sin cancelar el turno. Respuesta esperada HTTP 409.

PATCH de estado opcional: `PATCH /api/turnos/4`, body `{"estado":"Confirmado"}`.

## Relacion con los requerimientos iniciales
- RF03: registrar un turno mediante POST.
- RF04: listar turnos mediante GET.
- RF05: confirmar/cancelar mediante PATCH.
- RF01: pacientes sigue con almacenamiento local; se migrara a base de datos mas adelante.
- RF02: horarios libres calculados con los turnos recibidos desde GET.

## Capturas para el PDF solicitado
1. Portada con titulo, asignatura, integrantes.
2. Recurso elegido: turnos medicos, relacion RF03/RF04.
3. Tabla de endpoints anterior.
4. Captura de GET exitoso (JSON + codigo HTTP 200).
5. Captura de POST exitoso (JSON + codigo HTTP 201).
6. Captura del POST invalido (JSON + codigo HTTP 400).
7. Captura de la pagina `/turnos` con datos obtenidos del backend.
8. Explicacion breve de persistencia futura: tablas pacientes, profesionales y turnos en PostgreSQL mediante Prisma.

No se incluyen capturas ficticias: realizarlas con el servidor local funcionando. La entrega requiere demo grupal de ~8-10 minutos.

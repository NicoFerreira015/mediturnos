# MediTurnos — PostgreSQL y Prisma (siguiente etapa)

## Qué cambió

- **Pacientes:** `GET /api/pacientes` y `POST /api/pacientes`, con validaciones y cédula única.
- **Profesionales:** `GET /api/profesionales` (catálogo desde la base de datos).
- **Turnos:** `GET /api/turnos`, `POST /api/turnos`, `GET /api/turnos/:id` y `PATCH /api/turnos/:id`.
- **Pantallas:** el listado y alta de pacientes, la reserva y el listado de turnos ahora usan esas APIs.
- **Relaciones:** cada turno pertenece a un paciente y a un profesional. Un índice parcial en PostgreSQL evita reservar dos turnos activos para el mismo profesional, fecha y hora.
- La demo de JSONPlaceholder del Indicador 3 se conserva.

## Antes de empezar

Necesitás **Node.js** (preferiblemente 22), npm y Docker Desktop **o** PostgreSQL instalado y activo. Usá la carpeta del proyecto que viene en este ZIP; la carpeta del Indicador 4 anterior no contiene esta integración.

> **Importante:** en la etapa anterior los pacientes adicionales estaban en el `localStorage` del navegador y los turnos adicionales en la memoria del proceso Node. **No se transfieren automáticamente** a la nueva base de datos. Esta versión siembra los 3 pacientes, 3 profesionales y 3 turnos de demostración originales. Si necesitás preservar turnos posteriores (por ejemplo los de César o el turno nuevo de Lucía), exportalos/copialos antes de reemplazar tu proyecto; no borres el navegador ni el servidor anterior hasta respaldarlos. Más adelante se pueden importar con un procedimiento controlado.

## Instalación (PowerShell o terminal de VS Code)

1. Descomprimí el ZIP y abrí la carpeta `mediturnos-main` en VS Code.
2. Abrí Docker Desktop y esperá que indique que está ejecutándose.
3. En la terminal del proyecto, ejecutá:

```bash
docker compose up -d
```

Esto inicia PostgreSQL 16 en el puerto local `5432`. Si ya lo tenés ocupado, cambiá el mapeo en `docker-compose.yml` y también el puerto de `DATABASE_URL`. Si no usás Docker, creá manualmente la base `mediturnos` y un usuario con permisos de crear tablas.

4. Creá el archivo `.env` (podés copiar `.env.example`) y dejá:

```env
DATABASE_URL="postgresql://mediturnos:mediturnos_dev@localhost:5432/mediturnos?schema=public"
```

Estas credenciales son **solo para desarrollo local**; elegí contraseñas más fuertes en otro entorno. No publiques `.env` ni lo subas a GitHub.

5. Instalá las dependencias (también actualiza `package-lock.json`):

```bash
npm install
```

6. Generá Prisma Client, creá las tablas según la migración versionada y cargá datos iniciales:

```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

7. Iniciá la web:

```bash
npm run dev
```

8. Abrí `http://localhost:3000` y `http://localhost:3000/api/turnos`.

### Comprobaciones

- Abrí `http://localhost:3000/api/pacientes` → JSON con tres pacientes iniciales.
- Abrí `http://localhost:3000/api/profesionales` → JSON con tres profesionales.
- Abrí `http://localhost:3000/api/turnos` → JSON con tres turnos iniciales.
- En **Nuevo paciente**, registrá un paciente y volvé al listado.
- En **Nuevo turno**, reservá un horario disponible para ese paciente. Verificá el listado.
- Detené `npm run dev`, volvé a iniciarlo: los nuevos pacientes y turnos **deben seguir apareciendo**.
- Probá confirmar y cancelar un turno. Intentá reservar dos turnos activos para el mismo profesional, fecha y hora: el segundo POST debe responder `409`.
- Opcional: `npx prisma studio` permite inspeccionar las tablas visualmente.

## Estructura de datos

`Paciente (1) ─── (N) Turno (N) ─── (1) Profesional`

**Paciente:** nombre, cédula única, teléfono, correo, fecha de nacimiento y dirección.

**Profesional:** nombre y especialidad.

**Turno:** pacienteId, profesionalId, fecha (texto ISO `YYYY-MM-DD`), hora (`HH:mm`) y estado (`Pendiente`, `Confirmado` o `Cancelado`). Los nombres y la especialidad del JSON se resuelven con las relaciones, sin duplicarlos en el registro del turno.

La fecha y la hora se mantienen como cadenas ISO para conservar exactamente la semántica del formulario existente; una etapa futura puede incorporar zonas horarias y agenda formal.

## Notas técnicas

- La migración SQL incluye un índice único parcial `Turno_horario_activo_unique` que protege la reserva concurrente. Usá **`prisma migrate deploy`**; no sustituyas estas migraciones por `prisma db push`, pues `db push` no recrea ese índice parcial.
- No se añadió autenticación; es un prototipo académico. **No publiques datos personales reales** con APIs abiertas; para producción hay que añadir autenticación, autorización, privacidad y medidas de seguridad.
- `lib/storage.js` y `lib/turnos-server.js` permanecen como legado de las etapas anteriores, pero las pantallas y endpoints activos ya no los consultan para pacientes ni turnos.
- Este paquete se preparó sin acceso a npm ni una BD en el entorno de creación. **Falta verificar instalación, migración y funcionamiento en tu equipo.**
- Si instalás PostgreSQL sin Docker, cambiá las credenciales en `.env` según tu instalación.
- Para desplegar en Vercel, hay que crear PostgreSQL accesible desde el despliegue y configurar `DATABASE_URL` como variable de entorno; el contenedor Docker local no es accesible desde Vercel.

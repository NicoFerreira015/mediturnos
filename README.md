# MediTurnos 🩺

Sistema web para la **gestión de pacientes y turnos médicos**, desarrollado como proyecto académico para la asignatura **Desarrollo de Aplicaciones Web** (Universidad Americana).

**Repositorio:** https://github.com/NicoFerreira015/mediturnos

## Funcionalidades

- Registrar y listar pacientes.
- Consultar profesionales médicos y sus especialidades.
- Consultar disponibilidad y registrar turnos.
- Listar turnos y cambiar su estado: **Pendiente**, **Confirmado** o **Cancelado**.
- Validar datos en los formularios y en la API.
- Evitar la duplicación de turnos activos para un mismo profesional, fecha y hora.
- Conservar los registros en una base de datos PostgreSQL, incluso después de reiniciar la aplicación.

> **Regla de disponibilidad:** un turno **Pendiente** o **Confirmado** ocupa el horario; un turno **Cancelado** lo libera. Se recomienda probar esta regla al instalar y después de cualquier cambio.

## Tecnologías

| Componente | Tecnología |
| --- | --- |
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Backend | API Routes (Route Handlers) de Next.js |
| ORM | Prisma 6 |
| Base de datos | PostgreSQL 16 |
| Base de datos local | Docker Desktop + Docker Compose |
| Gestor de paquetes | npm |

## Requisitos para ejecutarlo

Instalar antes de comenzar:

1. **Git:** https://git-scm.com/downloads
2. **Node.js y npm:** https://nodejs.org/ (versión compatible con Next.js 16; se recomienda Node.js 20.9 o superior, preferentemente LTS).
3. **Docker Desktop:** https://www.docker.com/products/docker-desktop/ (en Windows, usar WSL 2 cuando corresponda).
4. Opcional: **Visual Studio Code:** https://code.visualstudio.com/

Comprobar que los comandos están disponibles (PowerShell):

```powershell
git --version
node --version
npm --version
docker --version
docker compose version
```

Abrir **Docker Desktop** y esperar a que el motor esté en funcionamiento antes de levantar PostgreSQL.

## Instalación desde cero en Windows (PowerShell)

### 1. Descargar el proyecto

```powershell
git clone https://github.com/NicoFerreira015/mediturnos.git
cd mediturnos
```

Si ya lo tenés clonado, actualizar desde la rama principal (antes, respaldar o confirmar los cambios locales):

```powershell
git pull origin main
```

### 2. Instalar dependencias

```powershell
npm ci
```

`npm ci` instala las versiones definidas en `package-lock.json`.

### 3. Crear y configurar `.env`

```powershell
Copy-Item .env.example .env
```

Por defecto, el proyecto incluye en `docker-compose.yml` un PostgreSQL de **desarrollo** publicado en el puerto **5432**. Si ese puerto está libre, usar en `.env`:

```dotenv
DATABASE_URL="postgresql://mediturnos:mediturnos_dev@localhost:5432/mediturnos?schema=public"
```

**Si ya existe otro PostgreSQL en Windows usando el puerto 5432** (como ocurrió durante nuestro desarrollo), cambiar **ambos** archivos:

En `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"
```

En `.env`:

```dotenv
DATABASE_URL="postgresql://mediturnos:mediturnos_dev@localhost:5433/mediturnos?schema=public"
```

**Importante:** `5433` es el puerto de acceso desde Windows; PostgreSQL sigue escuchando en `5432` *dentro* del contenedor. Si el puerto 5433 también está ocupado, seleccionar otro puerto libre y reflejarlo en ambos archivos.

> Las credenciales del `docker-compose.yml` están destinadas **únicamente a desarrollo local**. No reutilizarlas en producción. No subir `.env` a GitHub.

### 4. Iniciar PostgreSQL

Con Docker Desktop abierto:

```powershell
docker compose up -d
```

Comprobar:

```powershell
docker compose ps
```

El servicio `postgres` debe aparecer como `healthy` y mostrar el puerto elegido (por ejemplo `0.0.0.0:5433->5432/tcp`).

### 5. Generar Prisma Client y crear las tablas

Ejecutar **en este orden**, desde la carpeta del proyecto:

```powershell
npx prisma generate
npx prisma validate
npx prisma migrate deploy
```

La primera migración incluida crea las tablas de pacientes, profesionales y turnos. **No ejecutar `prisma migrate reset`**, ya que puede borrar los datos de la base.

### 6. Cargar datos de demostración

```powershell
npx prisma db seed
```

El script `prisma/seed.cjs` incorpora datos de ejemplo para probar el sistema. En una instalación nueva, ejecutarlo después de las migraciones. **No equivale a restaurar los datos reales de otra computadora.**

### 7. Iniciar MediTurnos

```powershell
npm run dev
```

Abrir **http://localhost:3000**.

Para detener el servidor de Next.js, presionar `Ctrl + C` en la terminal. La base de datos seguirá conservando los registros en el volumen de Docker.

## Cómo verificar que la base de datos funciona

En otra terminal, desde la carpeta del proyecto:

```powershell
npx prisma studio
```

En Prisma Studio se pueden inspeccionar las tablas **Paciente**, **Profesional** y **Turno**.

Prueba recomendada:

1. Registrar un paciente desde MediTurnos.
2. Crear un turno para ese paciente.
3. Verificar el registro en Gestión de Turnos y en Prisma Studio.
4. Detener Next.js y volver a ejecutar `npm run dev`.
5. Comprobar que el paciente y el turno continúan registrados.

## Endpoints del backend

| Método | Ruta | Función |
| --- | --- | --- |
| `GET` | `/api/pacientes` | Listar pacientes |
| `POST` | `/api/pacientes` | Registrar paciente |
| `GET` | `/api/profesionales` | Listar profesionales |
| `GET` | `/api/turnos` | Listar turnos |
| `POST` | `/api/turnos` | Registrar un turno |
| `PATCH` | `/api/turnos/:id` | Modificar el estado de un turno |

Respuestas HTTP utilizadas según el caso: `200` (consulta o actualización correcta), `201` (creación), `400` (datos inválidos), `404` (recurso no encontrado), `409` (conflicto de disponibilidad o cédula duplicada) y `500` (error del servidor).

Probar los listados desde el navegador:

- http://localhost:3000/api/pacientes
- http://localhost:3000/api/profesionales
- http://localhost:3000/api/turnos

Para ver la solicitud `POST` desde el frontend, abrir las herramientas del navegador (`F12` → **Network/Red**) y registrar un turno.

## Estructura principal

```text
mediturnos/
├── app/
│   ├── api/
│   │   ├── pacientes/route.js
│   │   ├── profesionales/route.js
│   │   └── turnos/
│   │       ├── route.js
│   │       └── [id]/route.js
│   ├── pacientes/
│   ├── turnos/
│   └── page.js
├── components/
├── lib/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.cjs
├── .env.example
├── docker-compose.yml
├── package.json
└── README.md
```

## Comandos útiles

| Comando | Uso |
| --- | --- |
| `npm run dev` | Iniciar aplicación en modo desarrollo |
| `npm run build` | Generar compilación de producción |
| `npm run start` | Ejecutar compilación producida con `build` |
| `npm run lint` | Ejecutar ESLint |
| `docker compose up -d` | Iniciar PostgreSQL |
| `docker compose ps` | Consultar estado de los contenedores |
| `docker compose down` | Detener y retirar contenedores sin eliminar el volumen |
| `npx prisma generate` | Generar Prisma Client |
| `npx prisma validate` | Validar esquema Prisma |
| `npx prisma migrate deploy` | Aplicar migraciones existentes |
| `npx prisma db seed` | Cargar datos de ejemplo |
| `npx prisma studio` | Abrir explorador visual de la base |

**No ejecutar `docker compose down -v` ni `docker volume rm`** si necesitás conservar tus pacientes y turnos: esas operaciones pueden eliminar el volumen de datos.

## Solución de problemas comunes

### `docker: The term 'docker' is not recognized`

Instalar Docker Desktop, iniciarlo y abrir una terminal nueva. En Windows, verificar que WSL 2 esté configurado si es requerido.

### `P1012: Environment variable not found: DATABASE_URL`

Comprobar que exista un archivo llamado exactamente `.env` en la raíz del proyecto, que tenga una línea `DATABASE_URL=...` y que se haya guardado. Ejecutar nuevamente `npx prisma validate`.

### `P1000: Authentication failed`

Verificar usuario, contraseña y puerto de `DATABASE_URL`. En nuestro equipo, el puerto **5432 ya estaba ocupado por un PostgreSQL instalado en Windows**; resolvimos el conflicto publicando el contenedor en **5433** y cambiando `.env` al mismo puerto.

Revisar puertos en PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 5432 -State Listen -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5433 -State Listen -ErrorAction SilentlyContinue
```

Y revisar el mapeo Docker:

```powershell
docker compose ps
```

No borrar el volumen como primera opción: primero comprobar a qué servidor PostgreSQL se está conectando Prisma.

### `Can't resolve '@prisma/client'`

Instalar las dependencias y generar el cliente:

```powershell
npm ci
npx prisma generate
```

Reiniciar `npm run dev` después de generar Prisma Client.

### El navegador muestra error 500 en `/api/turnos`

Comprobar que PostgreSQL esté activo (`docker compose ps`), que `.env` sea correcto y que las migraciones se hayan aplicado. Revisar el error detallado en la terminal donde se ejecuta Next.js.

### Advertencia sobre `package.json#prisma`

En Prisma 6 puede aparecer un aviso de deprecación sobre la configuración del seed en `package.json`. Es una advertencia y no impide ejecutar el proyecto actual; una actualización mayor de Prisma deberá evaluarse por separado.

## GitHub: guardar nuevos cambios

Dentro del proyecto clonado:

```powershell
git status
git add .
git commit -m "Actualizar MediTurnos"
git push origin main
```

Antes de confirmar cambios, revisar `git status` y asegurarse de **no** publicar `.env`, contraseñas privadas, respaldos de pacientes ni archivos de `node_modules`.

### Datos del proyecto y respaldo

- **GitHub guarda:** código, configuración Docker, migraciones y script de datos de ejemplo.
- **Docker/PostgreSQL guarda:** pacientes, profesionales y turnos registrados en la base local.
- **Clonar el repositorio en otro equipo no transfiere automáticamente los registros de la base original.** Para mover datos reales hace falta un respaldo y restauración controlada de PostgreSQL, manejando los datos personales de forma privada.
- El despliegue en producción requiere una base PostgreSQL accesible desde el servidor, variables de entorno seguras, migraciones y comprobación de compatibilidad del alojamiento. La configuración Docker incluida está pensada para desarrollo local.

## Documentación adicional

- [BASE_DE_DATOS_POSTGRESQL.md](BASE_DE_DATOS_POSTGRESQL.md): base de datos y Prisma.
- [INDICADOR_4_BACKEND.md](INDICADOR_4_BACKEND.md): backend y endpoints propios.
- [ENTREGA_API_GET.md](ENTREGA_API_GET.md): integración GET del indicador anterior.

---

**MediTurnos — Proyecto académico, Universidad Americana.**

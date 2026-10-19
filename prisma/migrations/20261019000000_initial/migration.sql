CREATE TABLE "Paciente" (
  "id" SERIAL PRIMARY KEY,
  "nombre" TEXT NOT NULL,
  "cedula" TEXT NOT NULL UNIQUE,
  "telefono" TEXT NOT NULL,
  "correo" TEXT NOT NULL,
  "fechaNacimiento" TEXT,
  "direccion" TEXT,
  "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "Profesional" (
  "id" SERIAL PRIMARY KEY,
  "nombre" TEXT NOT NULL,
  "especialidad" TEXT NOT NULL
);
CREATE TABLE "Turno" (
  "id" SERIAL PRIMARY KEY,
  "pacienteId" INTEGER NOT NULL REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "profesionalId" INTEGER NOT NULL REFERENCES "Profesional"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "fecha" TEXT NOT NULL,
  "hora" TEXT NOT NULL,
  "estado" TEXT NOT NULL DEFAULT 'Pendiente',
  "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Turno_fecha_profesionalId_idx" ON "Turno" ("fecha", "profesionalId");
-- Avoid simultaneous active reservations for the same professional/date/time.
-- A cancelled appointment does not block availability.
CREATE UNIQUE INDEX "Turno_horario_activo_unique" ON "Turno" ("profesionalId", "fecha", "hora") WHERE "estado" <> 'Cancelado';

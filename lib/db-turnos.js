import { prisma } from "@/lib/prisma";
const incluir = { paciente: true, profesional: true };
export function formatoTurno(t) {
  return { id: t.id, pacienteId: t.pacienteId, paciente: t.paciente.nombre,
    profesionalId: t.profesionalId, profesional: t.profesional.nombre,
    especialidad: t.profesional.especialidad, fecha: t.fecha, hora: t.hora, estado: t.estado };
}
export async function listarTurnos() {
  const turnos = await prisma.turno.findMany({ include: incluir, orderBy: [{ fecha: "desc" }, { hora: "asc" }, { id: "desc" }] });
  return turnos.map(formatoTurno);
}
export async function obtenerTurno(id) {
  const turno = await prisma.turno.findUnique({ where: { id }, include: incluir });
  return turno ? formatoTurno(turno) : null;
}
export async function crearTurno(datos) {
  // The database partial unique index closes the concurrency race between clients.
  const creado = await prisma.turno.create({ data: {
    pacienteId: Number(datos.pacienteId), profesionalId: Number(datos.profesionalId),
    fecha: datos.fecha, hora: datos.hora, estado: "Pendiente"
  }, include: incluir });
  return formatoTurno(creado);
}
export async function actualizarTurno(id, estado) {
  const actualizado = await prisma.turno.update({ where: { id }, data: { estado }, include: incluir });
  return formatoTurno(actualizado);
}

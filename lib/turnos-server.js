// Datos de demostración EN MEMORIA. No usar como almacenamiento de producción.
// En desarrollo, Next.js mantiene el módulo cargado entre solicitudes normales.
// El estado puede reiniciarse al recompilar o al reiniciar el servidor.
const turnosIniciales = [
  { id: 1, pacienteId: 1, paciente: "Lucía Fernández Ortiz", profesionalId: 1, profesional: "Dr. Molina", especialidad: "Clínica Médica", fecha: "2026-09-08", hora: "09:00", estado: "Confirmado" },
  { id: 2, pacienteId: 2, paciente: "Marcos Duarte", profesionalId: 2, profesional: "Dra. Aquino", especialidad: "Pediatría", fecha: "2026-09-08", hora: "09:30", estado: "Pendiente" },
  { id: 3, pacienteId: 3, paciente: "Rosa Benítez", profesionalId: 1, profesional: "Dr. Molina", especialidad: "Clínica Médica", fecha: "2026-09-08", hora: "10:15", estado: "Confirmado" }
];

const memoria = globalThis.__mediturnosMemoria ??= { turnos: structuredClone(turnosIniciales), siguienteId: 4 };
export function listarTurnos() { return [...memoria.turnos]; }
export function ocupado(profesionalId, fecha, hora) {
  return memoria.turnos.some(t => String(t.profesionalId) === String(profesionalId) && t.fecha === fecha && t.hora === hora && t.estado !== "Cancelado");
}
export function crearTurno(datos) {
  const nuevo = {
    id: memoria.siguienteId++, pacienteId: Number(datos.pacienteId), paciente: datos.paciente.trim(),
    profesionalId: Number(datos.profesionalId), profesional: datos.profesional.trim(),
    especialidad: datos.especialidad?.trim() || "", fecha: datos.fecha, hora: datos.hora, estado: "Pendiente"
  };
  memoria.turnos.unshift(nuevo);
  return nuevo;
}
export function cambiarEstado(id, estado) {
  const turno = memoria.turnos.find(t => String(t.id) === String(id));
  if (!turno) return null;
  turno.estado = estado;
  return turno;
}

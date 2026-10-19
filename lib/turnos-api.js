// Cliente HTTP para el backend propio del Indicador 4.
export async function consultarTurnos() {
  const respuesta = await fetch("/api/turnos", { cache: "no-store" });
  if (!respuesta.ok) throw new Error("No se pudieron consultar los turnos.");
  return (await respuesta.json()).turnos;
}
export async function registrarTurno(turno) {
  const respuesta = await fetch("/api/turnos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(turno) });
  const datos = await respuesta.json();
  if (!respuesta.ok) throw new Error(datos.error || "No se pudo registrar el turno.");
  return datos.turno;
}
export async function modificarEstadoTurno(id, estado) {
  const respuesta = await fetch(`/api/turnos/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ estado }) });
  const datos = await respuesta.json();
  if (!respuesta.ok) throw new Error(datos.error || "No se pudo modificar el turno.");
  return datos.turno;
}
export function estaOcupadoEnLista(turnos, profesionalId, fecha, hora) {
  return turnos.some(t => String(t.profesionalId) === String(profesionalId) && t.fecha === fecha && t.hora === hora && t.estado !== "Cancelado");
}

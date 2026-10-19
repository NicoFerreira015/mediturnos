async function jsonRespuesta(respuesta) {
  const datos = await respuesta.json();
  if (!respuesta.ok) throw new Error(datos.error || "Error al consultar pacientes.");
  return datos;
}
export async function consultarPacientes() {
  return (await jsonRespuesta(await fetch("/api/pacientes", { cache: "no-store" }))).pacientes;
}
export async function registrarPaciente(datos) {
  return (await jsonRespuesta(await fetch("/api/pacientes", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos)
  }))).paciente;
}

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  for (const p of [
    { id: 1, nombre: "Lucía Fernández Ortiz", cedula: "4582910", telefono: "0981234567", correo: "lucia.fernandez@email.com", fechaNacimiento: "1995-04-12", direccion: "Av. Mariscal López 1234, Asunción" },
    { id: 2, nombre: "Marcos Duarte", cedula: "3219884", telefono: "0971123456", correo: "marcos.duarte@email.com", fechaNacimiento: "1988-08-23", direccion: "San Lorenzo" },
    { id: 3, nombre: "Rosa Benítez", cedula: "2904117", telefono: "0982123456", correo: "rosa.benitez@email.com", fechaNacimiento: "1992-02-15", direccion: "Fernando de la Mora" }
  ]) await prisma.paciente.upsert({ where: { id: p.id }, create: p, update: {} });
  for (const p of [
    { id: 1, nombre: "Dr. Molina", especialidad: "Clínica Médica" },
    { id: 2, nombre: "Dra. Aquino", especialidad: "Pediatría" },
    { id: 3, nombre: "Dr. Ríos", especialidad: "Traumatología" }
  ]) await prisma.profesional.upsert({ where: { id: p.id }, create: p, update: {} });
  for (const t of [
    { id: 1, pacienteId: 1, profesionalId: 1, fecha: "2026-09-08", hora: "09:00", estado: "Confirmado" },
    { id: 2, pacienteId: 2, profesionalId: 2, fecha: "2026-09-08", hora: "09:30", estado: "Pendiente" },
    { id: 3, pacienteId: 3, profesionalId: 1, fecha: "2026-09-08", hora: "10:15", estado: "Confirmado" }
  ]) await prisma.turno.upsert({ where: { id: t.id }, create: t, update: {} });
  // SERIAL sequences must advance beyond explicit seed IDs.
  for (const tabla of ["Paciente", "Profesional", "Turno"]) {
    await prisma.$queryRawUnsafe(`SELECT setval(pg_get_serial_sequence('"${tabla}"', 'id'), GREATEST((SELECT COALESCE(MAX("id"), 0) FROM "${tabla}"), 1), true)`);
  }
  console.log("Datos de demostración cargados.");
}
main().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());

import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { listarTurnos, crearTurno } from "@/lib/db-turnos";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return NextResponse.json({ turnos: await listarTurnos() }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("GET turnos", error);
    return NextResponse.json({ error: "No se pudieron consultar los turnos." }, { status: 500 });
  }
}
export async function POST(request) {
  let d;
  try { d = await request.json(); } catch { return NextResponse.json({ error: "JSON inválido." }, { status: 400 }); }
  if (!d || typeof d !== "object" || Array.isArray(d) ||
      !Number.isSafeInteger(Number(d.pacienteId)) || Number(d.pacienteId) <= 0 ||
      !Number.isSafeInteger(Number(d.profesionalId)) || Number(d.profesionalId) <= 0 ||
      typeof d.fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(d.fecha) ||
      !Number.isFinite(Date.parse(d.fecha + "T00:00:00Z")) || new Date(d.fecha + "T00:00:00Z").toISOString().slice(0, 10) !== d.fecha ||
      typeof d.hora !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(d.hora)) {
    return NextResponse.json({ error: "pacienteId, profesionalId, fecha y hora válidos son obligatorios." }, { status: 400 });
  }
  try {
    const paciente = await prisma.paciente.findUnique({ where: { id: Number(d.pacienteId) } });
    const profesional = await prisma.profesional.findUnique({ where: { id: Number(d.profesionalId) } });
    if (!paciente || !profesional) return NextResponse.json({ error: "Paciente o profesional no existe." }, { status: 404 });
    return NextResponse.json({ turno: await crearTurno(d) }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
      return NextResponse.json({ error: "El profesional ya tiene un turno activo en ese horario." }, { status: 409 });
    console.error("POST turnos", error);
    return NextResponse.json({ error: "No se pudo registrar el turno." }, { status: 500 });
  }
}

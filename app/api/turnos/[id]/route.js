import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { obtenerTurno, actualizarTurno } from "@/lib/db-turnos";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
function numeroId(id) { const n = Number(id); return Number.isSafeInteger(n) && n > 0 ? n : null; }
export async function GET(_request, { params }) {
  const id = numeroId((await params).id);
  if (!id) return NextResponse.json({ error: "Identificador inválido." }, { status: 400 });
  try {
    const turno = await obtenerTurno(id);
    return turno ? NextResponse.json({ turno }) : NextResponse.json({ error: "Turno no encontrado." }, { status: 404 });
  } catch (error) {
    console.error("GET turno", error);
    return NextResponse.json({ error: "No se pudo obtener el turno." }, { status: 500 });
  }
}
export async function PATCH(request, { params }) {
  const id = numeroId((await params).id);
  if (!id) return NextResponse.json({ error: "Identificador inválido." }, { status: 400 });
  let d;
  try { d = await request.json(); } catch { return NextResponse.json({ error: "JSON inválido." }, { status: 400 }); }
  if (!d || !["Pendiente", "Confirmado", "Cancelado"].includes(d.estado))
    return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
  try {
    const actual = await obtenerTurno(id);
    if (!actual) return NextResponse.json({ error: "Turno no encontrado." }, { status: 404 });
    return NextResponse.json({ turno: await actualizarTurno(id, d.estado) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
      return NextResponse.json({ error: "El horario ya fue reservado por otro turno." }, { status: 409 });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
      return NextResponse.json({ error: "Turno no encontrado." }, { status: 404 });
    console.error("PATCH turno", error);
    return NextResponse.json({ error: "No se pudo actualizar el estado." }, { status: 500 });
  }
}

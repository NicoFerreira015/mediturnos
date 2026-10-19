import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pacientes = await prisma.paciente.findMany({ orderBy: { id: "desc" } });
    return NextResponse.json({ pacientes }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("GET pacientes", error);
    return NextResponse.json({ error: "No se pudieron obtener los pacientes." }, { status: 500 });
  }
}
export async function POST(request) {
  let d;
  try { d = await request.json(); } catch { return NextResponse.json({ error: "JSON inválido." }, { status: 400 }); }
  if (!d || typeof d !== "object" || Array.isArray(d) ||
      typeof d.nombre !== "string" || d.nombre.trim().length < 3 ||
      typeof d.cedula !== "string" || !/^\d{5,}$/.test(d.cedula.trim()) ||
      typeof d.telefono !== "string" || !/^\d+$/.test(d.telefono.trim()) ||
      typeof d.correo !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.correo.trim()) ||
      (d.fechaNacimiento && (typeof d.fechaNacimiento !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(d.fechaNacimiento) ||
      !Number.isFinite(Date.parse(d.fechaNacimiento + "T00:00:00Z")) || new Date(d.fechaNacimiento + "T00:00:00Z").toISOString().slice(0, 10) !== d.fechaNacimiento || d.fechaNacimiento > new Date().toISOString().slice(0, 10))) ||
      (d.direccion !== undefined && typeof d.direccion !== "string")) {
    return NextResponse.json({ error: "Nombre, cédula, teléfono y correo válidos son obligatorios." }, { status: 400 });
  }
  try {
    const paciente = await prisma.paciente.create({ data: {
      nombre: d.nombre.trim(), cedula: d.cedula.trim(), telefono: d.telefono.trim(),
      correo: d.correo.trim().toLowerCase(), fechaNacimiento: d.fechaNacimiento || null,
      direccion: d.direccion?.trim() || null
    } });
    return NextResponse.json({ paciente }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
      return NextResponse.json({ error: "Ya existe un paciente con esta cédula." }, { status: 409 });
    console.error("POST pacientes", error);
    return NextResponse.json({ error: "No se pudo registrar al paciente." }, { status: 500 });
  }
}

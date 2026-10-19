import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const profesionales = await prisma.profesional.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json({ profesionales }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("GET profesionales", error);
    return NextResponse.json({ error: "No se pudieron obtener los profesionales." }, { status: 500 });
  }
}

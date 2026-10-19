import { PrismaClient } from "@prisma/client";
const prismaGlobal = globalThis;
export const prisma = prismaGlobal.__mediturnosPrisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") prismaGlobal.__mediturnosPrisma = prisma;

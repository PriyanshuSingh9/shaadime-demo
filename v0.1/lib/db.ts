import { PrismaClient } from "@/lib/generated/prisma/client";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const url = process.env.DATABASE_URL;
    console.log("[db] Creating Prisma client, DATABASE_URL:", url ? url.substring(0, 40) + "..." : "MISSING");
    const pool = new Pool({ connectionString: url });
    const adapter = new PrismaNeon(pool as any);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
}

// Export a getter so the client is always fresh
export { getPrismaClient };

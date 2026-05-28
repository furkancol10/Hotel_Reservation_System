import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = (globalThis as any).__prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  (globalThis as any).__prisma = prisma;
}

export { prisma };

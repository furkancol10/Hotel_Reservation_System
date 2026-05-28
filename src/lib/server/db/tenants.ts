import { prisma } from '../prisma';

export async function getTenant(id?: string) {
  if (id) {
    return prisma.tenant.findUnique({ where: { id } });
  }
  // Return first active tenant (default for Phase 1 - no auth)
  return prisma.tenant.findFirst({ where: { isActive: true } });
}

export async function updateTenant(id: string, data: {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
  themeColor?: string;
  defaultLanguage?: string;
  timezone?: string;
}) {
  return prisma.tenant.update({ where: { id }, data });
}

import { prisma } from '../prisma';
import type { UserRole } from '@prisma/client';

export async function getUsers(tenantId: string, role?: UserRole) {
  return prisma.user.findMany({
    where: {
      tenantId,
      ...(role ? { role } : {}),
      isActive: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getGuestUsers(tenantId: string) {
  return prisma.user.findMany({
    where: { tenantId, role: 'GUEST', isActive: true },
    include: {
      reservations: {
        select: { id: true, status: true, checkInDate: true },
        orderBy: { checkInDate: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      reservations: {
        include: { room: { include: { roomType: true } } },
        orderBy: { checkInDate: 'desc' },
      },
    },
  });
}

export async function createUser(data: {
  tenantId: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
}) {
  return prisma.user.create({ data });
}

export async function updateUser(id: string, data: {
  email?: string;
  fullName?: string;
  role?: UserRole;
  phone?: string;
  isActive?: boolean;
}) {
  return prisma.user.update({ where: { id }, data });
}

export async function deleteUser(id: string) {
  return prisma.user.update({
    where: { id },
    data: { isActive: false },
  });
}

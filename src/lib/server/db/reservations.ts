import { prisma } from '../prisma';
import type { ReservationStatus } from '@prisma/client';

export async function getReservations(tenantId: string, filters?: {
  status?: ReservationStatus;
  from?: Date;
  to?: Date;
  guestId?: string;
}) {
  return prisma.reservation.findMany({
    where: {
      tenantId,
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.guestId ? { guestId: filters.guestId } : {}),
      ...(filters?.from ? { checkInDate: { gte: filters.from } } : {}),
      ...(filters?.to ? { checkOutDate: { lte: filters.to } } : {}),
    },
    include: {
      guest: { select: { id: true, fullName: true, email: true, phone: true } },
      room: {
        select: { id: true, roomNumber: true, floor: true, roomType: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getReservationById(id: string) {
  return prisma.reservation.findUnique({
    where: { id },
    include: {
      guest: true,
      room: { include: { roomType: true } },
    },
  });
}

export async function createReservation(data: {
  tenantId: string;
  guestId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  guestCount: number;
  totalPrice: number;
  currency?: string;
  specialRequests?: string;
}) {
  return prisma.reservation.create({
    data: {
      ...data,
      status: 'PENDING',
    },
    include: {
      guest: { select: { fullName: true, email: true } },
      room: { select: { roomNumber: true, roomType: { select: { name: true } } } },
    },
  });
}

export async function updateReservationStatus(id: string, status: ReservationStatus) {
  // When checking in, mark room as occupied
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    select: { roomId: true },
  });

  if (status === 'CHECKED_IN' && reservation) {
    await prisma.room.update({
      where: { id: reservation.roomId },
      data: { status: 'OCCUPIED' },
    });
  }

  // When checking out or cancelling, mark room as available
  if ((status === 'CHECKED_OUT' || status === 'CANCELLED') && reservation) {
    await prisma.room.update({
      where: { id: reservation.roomId },
      data: { status: 'AVAILABLE' },
    });
  }

  return prisma.reservation.update({
    where: { id },
    data: { status },
    include: {
      guest: { select: { fullName: true } },
      room: { select: { roomNumber: true } },
    },
  });
}

export async function cancelReservation(id: string) {
  return updateReservationStatus(id, 'CANCELLED');
}

export async function getReservationStats(tenantId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [total, active, pending, monthlyRevenue] = await Promise.all([
    prisma.reservation.count({ where: { tenantId } }),
    prisma.reservation.count({
      where: { tenantId, status: { in: ['CONFIRMED', 'CHECKED_IN'] } },
    }),
    prisma.reservation.count({
      where: { tenantId, status: 'PENDING' },
    }),
    prisma.reservation.aggregate({
      where: {
        tenantId,
        status: { in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'] },
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { totalPrice: true },
    }),
  ]);

  return {
    total,
    active,
    pending,
    monthlyRevenue: Number(monthlyRevenue._sum.totalPrice || 0),
  };
}

export async function getRecentReservations(tenantId: string, limit = 5) {
  return prisma.reservation.findMany({
    where: { tenantId },
    include: {
      guest: { select: { fullName: true, email: true } },
      room: { select: { roomNumber: true, roomType: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

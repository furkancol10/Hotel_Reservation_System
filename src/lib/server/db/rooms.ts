import { prisma } from '../prisma';
import type { RoomStatus } from '@prisma/client';

export async function getRooms(tenantId: string, filters?: {
  status?: RoomStatus;
  floor?: number;
  roomTypeId?: string;
}) {
  return prisma.room.findMany({
    where: {
      tenantId,
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.floor ? { floor: filters.floor } : {}),
      ...(filters?.roomTypeId ? { roomTypeId: filters.roomTypeId } : {}),
    },
    include: {
      roomType: {
        select: { id: true, name: true, basePricePerNight: true, currency: true, capacity: true },
      },
    },
    orderBy: [{ floor: 'asc' }, { roomNumber: 'asc' }],
  });
}

export async function getRoomById(id: string) {
  return prisma.room.findUnique({
    where: { id },
    include: {
      roomType: true,
      reservations: {
        include: { guest: { select: { id: true, fullName: true, email: true } } },
        orderBy: { checkInDate: 'desc' },
        take: 5,
      },
    },
  });
}

export async function getAvailableRooms(tenantId: string, checkIn: Date, checkOut: Date, roomTypeId?: string) {
  return prisma.room.findMany({
    where: {
      tenantId,
      status: 'AVAILABLE',
      ...(roomTypeId ? { roomTypeId } : {}),
      reservations: {
        none: {
          status: { in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] },
          checkInDate: { lt: checkOut },
          checkOutDate: { gt: checkIn },
        },
      },
    },
    include: {
      roomType: {
        select: { id: true, name: true, basePricePerNight: true, currency: true, capacity: true },
      },
    },
    orderBy: [{ floor: 'asc' }, { roomNumber: 'asc' }],
  });
}

export async function createRoom(data: {
  tenantId: string;
  roomTypeId: string;
  roomNumber: string;
  floor: number;
  status?: RoomStatus;
  notes?: string;
}) {
  return prisma.room.create({
    data,
    include: { roomType: true },
  });
}

export async function updateRoom(id: string, data: {
  roomTypeId?: string;
  roomNumber?: string;
  floor?: number;
  status?: RoomStatus;
  notes?: string;
}) {
  return prisma.room.update({
    where: { id },
    data,
    include: { roomType: true },
  });
}

export async function updateRoomStatus(id: string, status: RoomStatus) {
  return prisma.room.update({
    where: { id },
    data: { status },
  });
}

export async function deleteRoom(id: string) {
  return prisma.room.delete({ where: { id } });
}

export async function getRoomStats(tenantId: string) {
  const [total, available, occupied, maintenance] = await Promise.all([
    prisma.room.count({ where: { tenantId } }),
    prisma.room.count({ where: { tenantId, status: 'AVAILABLE' } }),
    prisma.room.count({ where: { tenantId, status: 'OCCUPIED' } }),
    prisma.room.count({ where: { tenantId, status: 'MAINTENANCE' } }),
  ]);

  return {
    total,
    available,
    occupied,
    maintenance,
    occupancyRate: total > 0 ? Math.round((occupied / total) * 100) : 0,
  };
}

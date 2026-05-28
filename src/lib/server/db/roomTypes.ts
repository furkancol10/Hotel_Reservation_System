import { prisma } from '../prisma';

export async function getRoomTypes(tenantId: string) {
  return prisma.roomType.findMany({
    where: { tenantId, isActive: true },
    include: {
      _count: { select: { rooms: true } },
    },
    orderBy: { basePricePerNight: 'asc' },
  });
}

export async function getRoomTypeById(id: string) {
  return prisma.roomType.findUnique({
    where: { id },
    include: {
      rooms: true,
      _count: { select: { rooms: true } },
    },
  });
}

export async function createRoomType(data: {
  tenantId: string;
  name: string;
  description?: string;
  capacity: number;
  basePricePerNight: number;
  currency?: string;
  amenities?: string[];
  photos?: string[];
}) {
  return prisma.roomType.create({
    data: {
      ...data,
      basePricePerNight: data.basePricePerNight,
      amenities: data.amenities || [],
      photos: data.photos || [],
    },
  });
}

export async function updateRoomType(id: string, data: {
  name?: string;
  description?: string;
  capacity?: number;
  basePricePerNight?: number;
  currency?: string;
  amenities?: string[];
  photos?: string[];
  isActive?: boolean;
}) {
  return prisma.roomType.update({ where: { id }, data });
}

export async function deleteRoomType(id: string) {
  return prisma.roomType.update({
    where: { id },
    data: { isActive: false },
  });
}

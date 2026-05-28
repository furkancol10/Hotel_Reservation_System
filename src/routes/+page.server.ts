import type { PageServerLoad } from './$types';
import { getTenant } from '$lib/server/db/tenants';
import { getRoomStats } from '$lib/server/db/rooms';
import { getReservationStats, getRecentReservations } from '$lib/server/db/reservations';

export const load: PageServerLoad = async () => {
  const tenant = await getTenant();
  if (!tenant) {
    return { roomStats: null, reservationStats: null, recentReservations: [] };
  }

  const [roomStats, reservationStats, recentReservations] = await Promise.all([
    getRoomStats(tenant.id),
    getReservationStats(tenant.id),
    getRecentReservations(tenant.id, 5),
  ]);

  return {
    roomStats,
    reservationStats,
    recentReservations: recentReservations.map((r: any) => ({
      id: r.id,
      guestName: r.guest.fullName,
      guestEmail: r.guest.email,
      roomNumber: r.room.roomNumber,
      roomType: r.room.roomType.name,
      checkIn: r.checkInDate.toISOString(),
      checkOut: r.checkOutDate.toISOString(),
      totalPrice: Number(r.totalPrice),
      currency: r.currency,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    })),
  };
};

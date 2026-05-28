import type { PageServerLoad, Actions } from './$types';
import { getTenant } from '$lib/server/db/tenants';
import { getReservations, updateReservationStatus, cancelReservation } from '$lib/server/db/reservations';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
  const tenant = await getTenant();
  if (!tenant) return { reservations: [] };

  const statusFilter = url.searchParams.get('status') as any;

  const reservations = await getReservations(tenant.id, {
    ...(statusFilter ? { status: statusFilter } : {}),
  });

  return {
    reservations: reservations.map((r: any) => ({
      id: r.id,
      guestName: r.guest.fullName,
      guestEmail: r.guest.email,
      guestPhone: r.guest.phone,
      roomNumber: r.room.roomNumber,
      roomType: r.room.roomType.name,
      floor: r.room.floor,
      checkIn: r.checkInDate.toISOString(),
      checkOut: r.checkOutDate.toISOString(),
      guestCount: r.guestCount,
      totalPrice: Number(r.totalPrice),
      currency: r.currency,
      status: r.status,
      specialRequests: r.specialRequests,
      createdAt: r.createdAt.toISOString(),
    })),
    currentFilter: statusFilter || '',
  };
};

export const actions: Actions = {
  updateStatus: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const status = formData.get('status') as any;

    try {
      await updateReservationStatus(id, status);
      return { success: true };
    } catch {
      return fail(500, { error: 'Failed to update status' });
    }
  },

  cancel: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    try {
      await cancelReservation(id);
      return { success: true };
    } catch {
      return fail(500, { error: 'Failed to cancel reservation' });
    }
  },
};

import type { PageServerLoad, Actions } from './$types';
import { getReservationById, updateReservationStatus, cancelReservation } from '$lib/server/db/reservations';
import { error, fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const reservation = await getReservationById(params.id);
  if (!reservation) throw error(404, 'Reservation not found');

  return {
    reservation: {
      id: reservation.id,
      guestName: reservation.guest.fullName,
      guestEmail: reservation.guest.email,
      guestPhone: reservation.guest.phone,
      roomNumber: reservation.room.roomNumber,
      roomType: reservation.room.roomType.name,
      roomFloor: reservation.room.floor,
      roomCapacity: reservation.room.roomType.capacity,
      checkIn: reservation.checkInDate.toISOString(),
      checkOut: reservation.checkOutDate.toISOString(),
      guestCount: reservation.guestCount,
      totalPrice: Number(reservation.totalPrice),
      currency: reservation.currency,
      status: reservation.status,
      specialRequests: reservation.specialRequests,
      createdAt: reservation.createdAt.toISOString(),
      updatedAt: reservation.updatedAt.toISOString(),
    },
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
    } catch {
      return fail(500, { error: 'Failed to cancel' });
    }
    throw redirect(303, '/reservations');
  },
};

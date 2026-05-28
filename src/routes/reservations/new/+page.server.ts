import type { PageServerLoad, Actions } from './$types';
import { getTenant } from '$lib/server/db/tenants';
import { getRoomTypes } from '$lib/server/db/roomTypes';
import { getGuestUsers } from '$lib/server/db/users';
import { getAvailableRooms } from '$lib/server/db/rooms';
import { createReservation } from '$lib/server/db/reservations';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
  const tenant = await getTenant();
  if (!tenant) return { roomTypes: [], guests: [], availableRooms: [] };

  const checkIn = url.searchParams.get('checkIn');
  const checkOut = url.searchParams.get('checkOut');
  const roomTypeId = url.searchParams.get('roomTypeId');

  const [roomTypes, guests] = await Promise.all([
    getRoomTypes(tenant.id),
    getGuestUsers(tenant.id),
  ]);

  let availableRooms: any[] = [];
  if (checkIn && checkOut) {
    availableRooms = await getAvailableRooms(
      tenant.id,
      new Date(checkIn),
      new Date(checkOut),
      roomTypeId || undefined
    );
  }

  return {
    roomTypes: roomTypes.map((rt: any) => ({
      id: rt.id,
      name: rt.name,
      capacity: rt.capacity,
      basePricePerNight: Number(rt.basePricePerNight),
      currency: rt.currency,
    })),
    guests: guests.map((g: any) => ({
      id: g.id,
      fullName: g.fullName,
      email: g.email,
    })),
    availableRooms: availableRooms.map((r) => ({
      id: r.id,
      roomNumber: r.roomNumber,
      floor: r.floor,
      roomTypeName: r.roomType.name,
      roomTypeId: r.roomTypeId,
      price: Number(r.roomType.basePricePerNight),
      currency: r.roomType.currency,
    })),
    filters: { checkIn, checkOut, roomTypeId },
  };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const tenant = await getTenant();
    if (!tenant) return fail(400, { error: 'No tenant found' });

    const formData = await request.formData();
    const guestId = formData.get('guestId') as string;
    const roomId = formData.get('roomId') as string;
    const checkInDate = formData.get('checkInDate') as string;
    const checkOutDate = formData.get('checkOutDate') as string;
    const guestCount = parseInt(formData.get('guestCount') as string) || 1;
    const specialRequests = formData.get('specialRequests') as string;
    const totalPrice = parseFloat(formData.get('totalPrice') as string);

    if (!guestId || !roomId || !checkInDate || !checkOutDate) {
      return fail(400, { error: 'Guest, room, check-in and check-out dates are required' });
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      return fail(400, { error: 'Check-out date must be after check-in date' });
    }

    if (isNaN(totalPrice) || totalPrice <= 0) {
      return fail(400, { error: 'Invalid total price' });
    }

    try {
      await createReservation({
        tenantId: tenant.id,
        guestId,
        roomId,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        guestCount,
        totalPrice,
        specialRequests: specialRequests || undefined,
      });
    } catch (e) {
      return fail(500, { error: 'Failed to create reservation' });
    }

    throw redirect(303, '/reservations');
  },
};

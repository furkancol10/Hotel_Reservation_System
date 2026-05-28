import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTenant } from '$lib/server/db/tenants';
import { getReservations, createReservation } from '$lib/server/db/reservations';

export const GET: RequestHandler = async ({ url }) => {
  const tenant = await getTenant();
  if (!tenant) return json([]);

  const status = url.searchParams.get('status') as any;
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  const reservations = await getReservations(tenant.id, {
    ...(status ? { status } : {}),
    ...(from ? { from: new Date(from) } : {}),
    ...(to ? { to: new Date(to) } : {}),
  });

  return json(reservations.map((r: any) => ({
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
  })));
};

export const POST: RequestHandler = async ({ request }) => {
  const tenant = await getTenant();
  if (!tenant) return json({ error: 'No tenant' }, { status: 400 });

  const data = await request.json();
  try {
    const reservation = await createReservation({ tenantId: tenant.id, ...data });
    return json(reservation, { status: 201 });
  } catch (e: any) {
    return json({ error: e.message }, { status: 400 });
  }
};

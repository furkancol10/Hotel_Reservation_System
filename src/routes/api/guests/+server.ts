import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTenant } from '$lib/server/db/tenants';
import { getGuestUsers } from '$lib/server/db/users';

export const GET: RequestHandler = async () => {
  const tenant = await getTenant();
  if (!tenant) return json([]);

  const guests = await getGuestUsers(tenant.id);
  return json(guests.map((g: any) => ({
    id: g.id,
    fullName: g.fullName,
    email: g.email,
    phone: g.phone,
    reservationCount: g.reservations.length,
  })));
};

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTenant } from '$lib/server/db/tenants';
import { getRoomTypes } from '$lib/server/db/roomTypes';

export const GET: RequestHandler = async () => {
  const tenant = await getTenant();
  if (!tenant) return json([]);

  const roomTypes = await getRoomTypes(tenant.id);
  return json(roomTypes.map((rt: any) => ({
    id: rt.id,
    name: rt.name,
    description: rt.description,
    capacity: rt.capacity,
    basePricePerNight: Number(rt.basePricePerNight),
    currency: rt.currency,
    amenities: rt.amenities,
    roomCount: rt._count.rooms,
  })));
};

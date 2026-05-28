import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTenant } from '$lib/server/db/tenants';
import { getRooms, getAvailableRooms, createRoom } from '$lib/server/db/rooms';

export const GET: RequestHandler = async ({ url }) => {
  const tenant = await getTenant();
  if (!tenant) return json([]);

  const available = url.searchParams.get('available');
  const checkIn = url.searchParams.get('checkIn');
  const checkOut = url.searchParams.get('checkOut');
  const roomTypeId = url.searchParams.get('roomTypeId');
  const status = url.searchParams.get('status') as any;
  const floor = url.searchParams.get('floor');

  if (available === 'true' && checkIn && checkOut) {
    const rooms = await getAvailableRooms(
      tenant.id,
      new Date(checkIn),
      new Date(checkOut),
      roomTypeId || undefined
    );
    return json(rooms.map((r: any) => ({
      id: r.id,
      roomNumber: r.roomNumber,
      floor: r.floor,
      roomTypeName: r.roomType.name,
      roomTypeId: r.roomTypeId,
      price: Number(r.roomType.basePricePerNight),
      currency: r.roomType.currency,
      capacity: r.roomType.capacity,
    })));
  }

  const rooms = await getRooms(tenant.id, {
    ...(status ? { status } : {}),
    ...(floor ? { floor: parseInt(floor) } : {}),
    ...(roomTypeId ? { roomTypeId } : {}),
  });

  return json(rooms.map((r: any) => ({
    id: r.id,
    roomNumber: r.roomNumber,
    floor: r.floor,
    status: r.status,
    roomType: r.roomType.name,
    roomTypeId: r.roomTypeId,
    price: Number(r.roomType.basePricePerNight),
    currency: r.roomType.currency,
  })));
};

export const POST: RequestHandler = async ({ request }) => {
  const tenant = await getTenant();
  if (!tenant) return json({ error: 'No tenant' }, { status: 400 });

  const data = await request.json();
  try {
    const room = await createRoom({ tenantId: tenant.id, ...data });
    return json(room, { status: 201 });
  } catch (e: any) {
    return json({ error: e.message }, { status: 400 });
  }
};

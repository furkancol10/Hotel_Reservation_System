import type { PageServerLoad, Actions } from './$types';
import { getTenant } from '$lib/server/db/tenants';
import { getRooms, createRoom, updateRoom, deleteRoom } from '$lib/server/db/rooms';
import { getRoomTypes } from '$lib/server/db/roomTypes';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
  const tenant = await getTenant();
  if (!tenant) return { rooms: [], roomTypes: [] };

  const statusFilter = url.searchParams.get('status') as any;
  const floorFilter = url.searchParams.get('floor');

  const [rooms, roomTypes] = await Promise.all([
    getRooms(tenant.id, {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(floorFilter ? { floor: parseInt(floorFilter) } : {}),
    }),
    getRoomTypes(tenant.id),
  ]);

  return {
    rooms: rooms.map((r: any) => ({
      id: r.id,
      roomNumber: r.roomNumber,
      floor: r.floor,
      status: r.status,
      notes: r.notes,
      roomType: r.roomType.name,
      roomTypeId: r.roomTypeId,
      price: Number(r.roomType.basePricePerNight),
      currency: r.roomType.currency,
      capacity: r.roomType.capacity,
    })),
    roomTypes: roomTypes.map((rt: any) => ({
      id: rt.id,
      name: rt.name,
    })),
  };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const tenant = await getTenant();
    if (!tenant) return fail(400, { error: 'No tenant found' });

    const formData = await request.formData();
    const roomNumber = formData.get('roomNumber') as string;
    const floor = parseInt(formData.get('floor') as string);
    const roomTypeId = formData.get('roomTypeId') as string;
    const notes = formData.get('notes') as string;

    if (!roomNumber || !roomTypeId || isNaN(floor)) {
      return fail(400, { error: 'Room number, floor, and room type are required' });
    }

    try {
      await createRoom({ tenantId: tenant.id, roomNumber, floor, roomTypeId, notes: notes || undefined });
      return { success: true };
    } catch (e: any) {
      if (e.code === 'P2002') {
        return fail(400, { error: 'Room number already exists' });
      }
      return fail(500, { error: 'Failed to create room' });
    }
  },

  update: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const roomNumber = formData.get('roomNumber') as string;
    const floor = parseInt(formData.get('floor') as string);
    const roomTypeId = formData.get('roomTypeId') as string;
    const status = formData.get('status') as any;
    const notes = formData.get('notes') as string;

    try {
      await updateRoom(id, {
        ...(roomNumber ? { roomNumber } : {}),
        ...(floor ? { floor } : {}),
        ...(roomTypeId ? { roomTypeId } : {}),
        ...(status ? { status } : {}),
        notes: notes || undefined,
      });
      return { success: true };
    } catch (e: any) {
      if (e.code === 'P2002') {
        return fail(400, { error: 'Room number already exists' });
      }
      return fail(500, { error: 'Failed to update room' });
    }
  },

  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    try {
      await deleteRoom(id);
      return { success: true };
    } catch {
      return fail(500, { error: 'Failed to delete room' });
    }
  },

  updateStatus: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const status = formData.get('status') as any;
    try {
      await updateRoom(id, { status });
      return { success: true };
    } catch {
      return fail(500, { error: 'Failed to update room status' });
    }
  },
};

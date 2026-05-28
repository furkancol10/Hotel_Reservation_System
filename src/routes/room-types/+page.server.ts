import type { PageServerLoad, Actions } from './$types';
import { getTenant } from '$lib/server/db/tenants';
import { getRoomTypes, createRoomType, updateRoomType, deleteRoomType } from '$lib/server/db/roomTypes';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  const tenant = await getTenant();
  if (!tenant) return { roomTypes: [] };

  const roomTypes = await getRoomTypes(tenant.id);

  return {
    roomTypes: roomTypes.map((rt: any) => ({
      id: rt.id,
      name: rt.name,
      description: rt.description,
      capacity: rt.capacity,
      basePricePerNight: Number(rt.basePricePerNight),
      currency: rt.currency,
      amenities: rt.amenities as string[],
      photos: rt.photos as string[],
      isActive: rt.isActive,
      roomCount: rt._count.rooms,
    })),
  };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const tenant = await getTenant();
    if (!tenant) return fail(400, { error: 'No tenant found' });

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const capacity = parseInt(formData.get('capacity') as string);
    const basePricePerNight = parseFloat(formData.get('basePricePerNight') as string);
    const currency = (formData.get('currency') as string) || 'USD';
    const amenitiesRaw = formData.getAll('amenities') as string[];

    if (!name || isNaN(capacity) || isNaN(basePricePerNight)) {
      return fail(400, { error: 'Name, capacity, and price are required' });
    }

    await createRoomType({
      tenantId: tenant.id,
      name,
      description: description || undefined,
      capacity,
      basePricePerNight,
      currency,
      amenities: amenitiesRaw,
    });
    return { success: true };
  },

  update: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const capacity = parseInt(formData.get('capacity') as string);
    const basePricePerNight = parseFloat(formData.get('basePricePerNight') as string);
    const currency = (formData.get('currency') as string) || 'USD';
    const amenitiesRaw = formData.getAll('amenities') as string[];

    await updateRoomType(id, {
      ...(name ? { name } : {}),
      ...(description !== null ? { description } : {}),
      ...(!isNaN(capacity) ? { capacity } : {}),
      ...(!isNaN(basePricePerNight) ? { basePricePerNight } : {}),
      currency,
      amenities: amenitiesRaw,
    });
    return { success: true };
  },

  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    await deleteRoomType(id);
    return { success: true };
  },
};

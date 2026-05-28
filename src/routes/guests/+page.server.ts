import type { PageServerLoad, Actions } from './$types';
import { getTenant } from '$lib/server/db/tenants';
import { getGuestUsers, createUser, updateUser, deleteUser } from '$lib/server/db/users';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  const tenant = await getTenant();
  if (!tenant) return { guests: [] };

  const guests = await getGuestUsers(tenant.id);

  return {
    guests: guests.map((g: any) => ({
      id: g.id,
      fullName: g.fullName,
      email: g.email,
      phone: g.phone,
      reservationCount: g.reservations.length,
      lastReservation: g.reservations[0]
        ? {
            checkIn: g.reservations[0].checkInDate.toISOString(),
            status: g.reservations[0].status,
          }
        : null,
    })),
  };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const tenant = await getTenant();
    if (!tenant) return fail(400, { error: 'No tenant found' });

    const formData = await request.formData();
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;

    if (!fullName || !email) {
      return fail(400, { error: 'Name and email are required' });
    }

    try {
      await createUser({ tenantId: tenant.id, email, fullName, role: 'GUEST', phone: phone || undefined });
      return { success: true };
    } catch (e: any) {
      if (e.code === 'P2002') {
        return fail(400, { error: 'Email already exists' });
      }
      return fail(500, { error: 'Failed to create guest' });
    }
  },

  update: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;

    try {
      await updateUser(id, {
        ...(fullName ? { fullName } : {}),
        ...(email ? { email } : {}),
        phone: phone || undefined,
      });
      return { success: true };
    } catch (e: any) {
      if (e.code === 'P2002') {
        return fail(400, { error: 'Email already exists' });
      }
      return fail(500, { error: 'Failed to update guest' });
    }
  },

  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    try {
      await deleteUser(id);
      return { success: true };
    } catch {
      return fail(500, { error: 'Failed to delete guest' });
    }
  },
};

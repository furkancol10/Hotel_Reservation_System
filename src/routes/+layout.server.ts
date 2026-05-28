import type { LayoutServerLoad } from './$types';
import { getTenant } from '$lib/server/db/tenants';

export const load: LayoutServerLoad = async () => {
  const tenant = await getTenant();

  return {
    tenant: tenant ? {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      logoUrl: tenant.logoUrl,
      themeColor: tenant.themeColor,
    } : null,
  };
};

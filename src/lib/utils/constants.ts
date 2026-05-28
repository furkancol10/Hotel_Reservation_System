type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export const ROOM_STATUS_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
  AVAILABLE: { label: 'Available', variant: 'success' },
  OCCUPIED: { label: 'Occupied', variant: 'danger' },
  MAINTENANCE: { label: 'Maintenance', variant: 'warning' },
};

export const RESERVATION_STATUS_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  CONFIRMED: { label: 'Confirmed', variant: 'info' },
  CHECKED_IN: { label: 'Checked In', variant: 'success' },
  CHECKED_OUT: { label: 'Checked Out', variant: 'neutral' },
  CANCELLED: { label: 'Cancelled', variant: 'danger' },
};

export const USER_ROLE_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
  ADMIN: { label: 'Admin', variant: 'info' },
  STAFF: { label: 'Staff', variant: 'warning' },
  GUEST: { label: 'Guest', variant: 'neutral' },
};

export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: 'dashboard' },
  { href: '/rooms', label: 'Rooms', icon: 'rooms' },
  { href: '/room-types', label: 'Room Types', icon: 'room-types' },
  { href: '/reservations', label: 'Reservations', icon: 'reservations' },
  { href: '/guests', label: 'Guests', icon: 'guests' },
] as const;

export const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'TRY', label: 'TRY (₺)' },
  { value: 'GBP', label: 'GBP (£)' },
];

export const DEFAULT_AMENITIES = [
  'WiFi',
  'Air Conditioning',
  'Mini Bar',
  'Room Service',
  'TV',
  'Safe',
  'Balcony',
  'Sea View',
  'City View',
  'Jacuzzi',
  'King Bed',
  'Twin Beds',
  'Workspace',
  'Coffee Machine',
];

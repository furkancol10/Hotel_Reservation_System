import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.reservation.deleteMany();
  await prisma.room.deleteMany();
  await prisma.roomType.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  // Create tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Grand Hotel Istanbul',
      slug: 'grand-hotel-istanbul',
      email: 'info@grandhotel.com',
      phone: '+90 212 555 0100',
      address: 'Beyoğlu, Istanbul, Turkey',
      logoUrl: null,
      themeColor: '#6366f1',
      defaultLanguage: 'en',
      timezone: 'Europe/Istanbul',
      isActive: true,
    },
  });
  console.log('✅ Tenant created:', tenant.name);

  // Create users
  const admin = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'admin@grandhotel.com',
      fullName: 'Ahmet Yılmaz',
      role: 'ADMIN',
      phone: '+90 532 100 0001',
      isActive: true,
    },
  });

  const staff1 = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'reception@grandhotel.com',
      fullName: 'Elif Demir',
      role: 'STAFF',
      phone: '+90 532 100 0002',
      isActive: true,
    },
  });

  const staff2 = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'manager@grandhotel.com',
      fullName: 'Mehmet Kaya',
      role: 'STAFF',
      phone: '+90 532 100 0003',
      isActive: true,
    },
  });

  const guest1 = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'john.doe@email.com',
      fullName: 'John Doe',
      role: 'GUEST',
      phone: '+1 555 123 4567',
      isActive: true,
    },
  });

  const guest2 = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'emma.wilson@email.com',
      fullName: 'Emma Wilson',
      role: 'GUEST',
      phone: '+44 20 7946 0958',
      isActive: true,
    },
  });

  const guest3 = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'marco.rossi@email.com',
      fullName: 'Marco Rossi',
      role: 'GUEST',
      phone: '+39 06 1234 5678',
      isActive: true,
    },
  });

  const guest4 = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'yuki.tanaka@email.com',
      fullName: 'Yuki Tanaka',
      role: 'GUEST',
      phone: '+81 3 1234 5678',
      isActive: true,
    },
  });

  const guest5 = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'sarah.johnson@email.com',
      fullName: 'Sarah Johnson',
      role: 'GUEST',
      phone: '+1 555 987 6543',
      isActive: true,
    },
  });

  console.log('✅ Users created: 1 admin, 2 staff, 5 guests');

  // Create room types
  const standard = await prisma.roomType.create({
    data: {
      tenantId: tenant.id,
      name: 'Standard Room',
      description: 'Comfortable room with all essential amenities for a pleasant stay. Features modern decor and city views.',
      capacity: 2,
      basePricePerNight: 120,
      currency: 'USD',
      amenities: ['WiFi', 'Air Conditioning', 'TV', 'Safe', 'Coffee Machine'],
      photos: [],
      isActive: true,
    },
  });

  const deluxe = await prisma.roomType.create({
    data: {
      tenantId: tenant.id,
      name: 'Deluxe Room',
      description: 'Spacious room with premium furnishings, king-size bed, and stunning Bosphorus views. Includes minibar and room service.',
      capacity: 2,
      basePricePerNight: 200,
      currency: 'USD',
      amenities: ['WiFi', 'Air Conditioning', 'TV', 'Safe', 'Mini Bar', 'Room Service', 'Sea View', 'King Bed', 'Coffee Machine'],
      photos: [],
      isActive: true,
    },
  });

  const suite = await prisma.roomType.create({
    data: {
      tenantId: tenant.id,
      name: 'Executive Suite',
      description: 'Luxurious suite with separate living area, workspace, and panoramic views. Perfect for business travelers seeking comfort and productivity.',
      capacity: 3,
      basePricePerNight: 350,
      currency: 'USD',
      amenities: ['WiFi', 'Air Conditioning', 'TV', 'Safe', 'Mini Bar', 'Room Service', 'Sea View', 'King Bed', 'Balcony', 'Workspace', 'Coffee Machine', 'Jacuzzi'],
      photos: [],
      isActive: true,
    },
  });

  const presidential = await prisma.roomType.create({
    data: {
      tenantId: tenant.id,
      name: 'Presidential Suite',
      description: 'The ultimate luxury experience. Two-bedroom suite with private terrace, butler service, and unparalleled Bosphorus panorama.',
      capacity: 4,
      basePricePerNight: 800,
      currency: 'USD',
      amenities: ['WiFi', 'Air Conditioning', 'TV', 'Safe', 'Mini Bar', 'Room Service', 'Sea View', 'City View', 'King Bed', 'Balcony', 'Workspace', 'Coffee Machine', 'Jacuzzi'],
      photos: [],
      isActive: true,
    },
  });

  console.log('✅ Room types created: Standard, Deluxe, Suite, Presidential');

  // Create rooms
  const rooms: any[] = [];
  const roomConfigs = [
    // Floor 1: Standard rooms
    { type: standard, floor: 1, numbers: ['101', '102', '103', '104', '105'] },
    // Floor 2: Standard + Deluxe
    { type: standard, floor: 2, numbers: ['201', '202'] },
    { type: deluxe, floor: 2, numbers: ['203', '204', '205'] },
    // Floor 3: Deluxe rooms
    { type: deluxe, floor: 3, numbers: ['301', '302', '303', '304'] },
    // Floor 4: Suites
    { type: suite, floor: 4, numbers: ['401', '402', '403'] },
    // Floor 5: Presidential
    { type: presidential, floor: 5, numbers: ['501'] },
  ];

  for (const config of roomConfigs) {
    for (const number of config.numbers) {
      const room = await prisma.room.create({
        data: {
          tenantId: tenant.id,
          roomTypeId: config.type.id,
          roomNumber: number,
          floor: config.floor,
          status: 'AVAILABLE',
        },
      });
      rooms.push(room);
    }
  }

  // Set some rooms to different statuses
  await prisma.room.update({ where: { id: rooms[2].id }, data: { status: 'OCCUPIED' } });
  await prisma.room.update({ where: { id: rooms[5].id }, data: { status: 'OCCUPIED' } });
  await prisma.room.update({ where: { id: rooms[10].id }, data: { status: 'MAINTENANCE', notes: 'Bathroom renovation in progress' } });
  await prisma.room.update({ where: { id: rooms[15].id }, data: { status: 'OCCUPIED' } });

  console.log(`✅ ${rooms.length} rooms created across 5 floors`);

  // Create reservations
  const now = new Date();

  // Past reservation - checked out
  await prisma.reservation.create({
    data: {
      tenantId: tenant.id,
      guestId: guest1.id,
      roomId: rooms[0].id,
      checkInDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
      checkOutDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4),
      guestCount: 2,
      totalPrice: 360,
      currency: 'USD',
      status: 'CHECKED_OUT',
      specialRequests: 'Late check-out requested',
    },
  });

  // Active reservation - checked in
  await prisma.reservation.create({
    data: {
      tenantId: tenant.id,
      guestId: guest2.id,
      roomId: rooms[2].id,
      checkInDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
      checkOutDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3),
      guestCount: 1,
      totalPrice: 480,
      currency: 'USD',
      status: 'CHECKED_IN',
      specialRequests: 'Extra pillows please',
    },
  });

  // Active reservation - checked in (deluxe)
  await prisma.reservation.create({
    data: {
      tenantId: tenant.id,
      guestId: guest3.id,
      roomId: rooms[5].id,
      checkInDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2),
      checkOutDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2),
      guestCount: 2,
      totalPrice: 800,
      currency: 'USD',
      status: 'CHECKED_IN',
    },
  });

  // Confirmed upcoming reservation
  await prisma.reservation.create({
    data: {
      tenantId: tenant.id,
      guestId: guest4.id,
      roomId: rooms[7].id,
      checkInDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2),
      checkOutDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5),
      guestCount: 2,
      totalPrice: 600,
      currency: 'USD',
      status: 'CONFIRMED',
      specialRequests: 'Anniversary celebration - champagne in room',
    },
  });

  // Pending reservation
  await prisma.reservation.create({
    data: {
      tenantId: tenant.id,
      guestId: guest5.id,
      roomId: rooms[12].id,
      checkInDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5),
      checkOutDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8),
      guestCount: 1,
      totalPrice: 1050,
      currency: 'USD',
      status: 'PENDING',
    },
  });

  // Suite reservation - checked in
  await prisma.reservation.create({
    data: {
      tenantId: tenant.id,
      guestId: guest1.id,
      roomId: rooms[15].id,
      checkInDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      checkOutDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4),
      guestCount: 3,
      totalPrice: 1400,
      currency: 'USD',
      status: 'CHECKED_IN',
      specialRequests: 'Need baby crib',
    },
  });

  // Cancelled reservation
  await prisma.reservation.create({
    data: {
      tenantId: tenant.id,
      guestId: guest3.id,
      roomId: rooms[3].id,
      checkInDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10),
      checkOutDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 13),
      guestCount: 2,
      totalPrice: 360,
      currency: 'USD',
      status: 'CANCELLED',
    },
  });

  // Future confirmed
  await prisma.reservation.create({
    data: {
      tenantId: tenant.id,
      guestId: guest2.id,
      roomId: rooms[8].id,
      checkInDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14),
      checkOutDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 18),
      guestCount: 2,
      totalPrice: 800,
      currency: 'USD',
      status: 'CONFIRMED',
    },
  });

  // Another pending
  await prisma.reservation.create({
    data: {
      tenantId: tenant.id,
      guestId: guest4.id,
      roomId: rooms[17].id,
      checkInDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
      checkOutDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10),
      guestCount: 4,
      totalPrice: 2400,
      currency: 'USD',
      status: 'PENDING',
      specialRequests: 'VIP guest - prepare presidential welcome',
    },
  });

  // Past checked out
  await prisma.reservation.create({
    data: {
      tenantId: tenant.id,
      guestId: guest5.id,
      roomId: rooms[6].id,
      checkInDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14),
      checkOutDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10),
      guestCount: 1,
      totalPrice: 800,
      currency: 'USD',
      status: 'CHECKED_OUT',
    },
  });

  console.log('✅ 10 reservations created');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

# Hotel Reservation System

Otel odalarını, oda tiplerini, misafirleri ve rezervasyonları yönetmek için geliştirilmiş SvelteKit tabanlı bir yönetim paneli. Veri modeli çok kiracılı (multi-tenant) tasarlanmıştır: her kayıt bir otele (`Tenant`) bağlıdır.

<!-- TODO: Ekran görüntüleri eklenecek (panel, oda listesi, rezervasyon formu) -->

## Özellikler

- Panel (dashboard) ana sayfası ve istatistik kartları
- Oda yönetimi (`/rooms`): oda numarası, kat, durum (müsait, dolu, bakımda)
- Oda tipi yönetimi (`/room-types`): kapasite, gecelik fiyat, para birimi, olanaklar
- Misafir listesi (`/guests`)
- Rezervasyon listesi, yeni rezervasyon oluşturma ve detay sayfası (`/reservations`, `/reservations/new`, `/reservations/[id]`)
- Rezervasyon durumları: bekliyor, onaylı, giriş yaptı, çıkış yaptı, iptal
- JSON API uçları: `/api/rooms`, `/api/room-types`, `/api/reservations`, `/api/guests`
- Örnek verili seed betiği (Grand Hotel Istanbul)

## Teknoloji

- SvelteKit 2, Svelte 5, TypeScript, Vite
- PostgreSQL
- Prisma 7 (`@prisma/adapter-pg` + `pg`)
- `dotenv`, `tsx` (seed çalıştırmak için)

## Kurulum

Gereksinimler: Node.js ve çalışan bir PostgreSQL veritabanı.

```bash
npm install
```

Proje kökünde `.env` dosyası oluşturun (repoda `.env.example` yoktur, `.env` git'e eklenmez):

```env
DATABASE_URL="postgresql://KULLANICI:SIFRE@localhost:5432/VERITABANI"
```

Şemayı veritabanına uygulayın. Repoda `prisma/migrations` klasörü yok, bu yüzden `db push` kullanılır:

```bash
npx prisma generate
npx prisma db push
```

Örnek veriyi yükleyin (mevcut tüm kayıtları siler):

```bash
npx prisma db seed
```

Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

## Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi |
| `npm run preview` | Derlemeyi önizleme |
| `npm run check` | `svelte-check` ile tip kontrolü |

## Proje yapısı

```
prisma/
  schema.prisma        Tenant, User, RoomType, Room, Reservation modelleri
  seed.ts              Örnek veri
prisma.config.ts       Prisma yapılandırması (DATABASE_URL, seed)
src/
  routes/              Sayfalar (rooms, room-types, guests, reservations) ve api/
  lib/server/prisma.ts Prisma istemcisi
  lib/server/db/       Veri erişim fonksiyonları
  lib/components/      ui/, layout/, dashboard/ bileşenleri
  lib/styles/          Global CSS
```

Şema diyagramı için `hotel reservation schema.pdf` dosyasına bakın.

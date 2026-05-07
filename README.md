# Pegasus — Japan Fest Campaign Platform

> Monorepo platform untuk manajemen event festival berbasis GraphQL. Terdiri dari tiga aplikasi: backend API (Phoenix), admin dashboard (Dolphin), dan public website (Falcon).

---

## Daftar Isi

1. [Product Thinking](#1-product-thinking)
2. [Technical Architecture](#2-technical-architecture)
3. [Data Modeling](#3-data-modeling)
4. [ERD (Entity Relationship Diagram)](#4-erd-entity-relationship-diagram)
5. [Flowchart](#5-flowchart)
6. [Scalability](#6-scalability)
7. [Getting Started](#7-getting-started)

---

## 1. Product Thinking

### Siapa yang menggunakan platform ini?

Platform Pegasus melayani dua jenis pengguna:

**Admin / Penyelenggara Event**
- Event organizer yang mengelola campaign festival (contoh: Tokyo Natsu Matsuri 2026)
- Bertugas membuat, mempublikasikan, dan memantau campaign
- Mengakses dashboard admin (Dolphin) untuk manajemen penuh

**Publik / Pengunjung**
- Masyarakat umum yang ingin mengetahui informasi festival
- Mendaftar undian tiket gratis atau melihat paket tiket tersedia
- Mengakses website publik (Falcon) tanpa perlu akun

---

### Masalah yang diselesaikan

| Masalah | Solusi |
|---------|--------|
| Organizer kesulitan mengelola banyak campaign event | Dashboard terpusat dengan CRUD campaign, role-based access |
| Proses registrasi peserta yang manual dan tidak terstruktur | Form pendaftaran digital dengan konfirmasi email otomatis |
| Tidak ada halaman publik yang informatif untuk promosi event | Landing page festival dengan informasi lengkap dan animasi menarik |
| Manajemen user dan hak akses yang tidak terkontrol | Role system (ADMIN / USER) dengan promote/demote dari dashboard |
| Tidak ada visibilitas statistik | Admin Stats: total user, admin aktif, status campaign|

---

## 2. Technical Architecture

### Stack

| Layer | Teknologi |
|-------|-----------|
| **Public Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS v4, GSAP |
| **Admin Frontend** | Next.js 16 (App Router), React 19, Material-UI v6, Tailwind CSS v4 |
| **Backend API** | NestJS, Apollo Server, GraphQL |
| **Database** | PostgreSQL |
| **Auth** | JWT (7-day expiry), bcrypt |
| **Email** | MailModule (resend) |
| **File Storage** | Cloudinary (image_url) |
| **Build Tool** | Turbo (monorepo pipeline) |
| **Package Manager** | pnpm workspaces |
| **Query Language** | GraphQL — `.gql` files + codegen |

---

### System Structure

```
                    ┌─────────────────────────────────────────┐
                    │           PEGASUS MONOREPO              │
                    └─────────────────────────────────────────┘
                                        │
              ┌─────────────────────────┼─────────────────────────┐
              │                         │                         │
    ┌─────────▼──────────┐   ┌─────────▼──────────┐   ┌─────────▼──────────┐
    │   FALCON           │   │   DOLPHIN          │   │   PHOENIX          │
    │   (Public Site)    │   │   (Admin Dashboard)│   │   (Backend API)    │
    │   Next.js 16       │   │   Next.js 16       │   │   NestJS + GraphQL │
    │   Port: 3001       │   │   Port: 3000       │   │   Port: 4000       │
    └─────────┬──────────┘   └─────────┬──────────┘   └─────────┬──────────┘
              │                        │                        │
              └──────────────┬─────────┘                        │
                             │  Apollo Client (GraphQL)         │
                             └──────────────────────────────────┘
                                                  │
                                      ┌───────────▼───────────┐
                                      │      PostgreSQL       │
                                      │      Database         │
                                      └───────────────────────┘
```

---

### Request Flow

```
[Visitor]                [Admin]
    │                       │
    ▼                       ▼
Falcon (3001)          Dolphin (3000)
    │                       │
    │   Apollo Client       │   Apollo Client
    │   (GraphQL Query)     │   (GraphQL Mutation)
    └──────────┬────────────┘
               ▼
        Phoenix (4000)
        NestJS + Apollo
               │
       ┌───────┴───────┐
       ▼               ▼
  PostgreSQL        Cloudinary
  (data store)      (images)
               │
               ▼
           MailService
           (email notif)
```

---

### Modul Phoenix

```
AppModule
├── ConfigModule          (env vars)
├── GraphQLModule         (Apollo Driver, schema auto-gen)
├── DatabaseModule        (PostgreSQL connection)
├── AuthModule            (login, register, JWT)
├── UserModule            (CRUD users)
├── CampaignModule        (CRUD campaigns)
├── SubmissionModule      (event registration)
├── AdminModule           (role management, stats)
├── MailModule            (email notification)
└── UploadModule          (Cloudinary file upload)
```

---

## 3. Data Modeling

### Entitas Utama

#### User
Representasi akun dalam sistem. Bisa berperan sebagai ADMIN (dapat mengakses Dolphin) atau USER biasa.

```
User
├── id            : UUID (PK)
├── name          : string
├── email         : string (unique)
├── password_hash : string (bcrypt, cost 12)
├── role          : enum { ADMIN, USER }
├── is_active     : boolean
├── created_at    : timestamp
└── updated_at    : timestamp
```

#### Campaign
Representasi sebuah event/festival yang dipublikasikan ke publik. Diakses melalui slug di URL.

```
Campaign
├── id          : UUID (PK)
├── name        : string
├── slug        : string (unique, kebab-case)
├── description : text | null
├── image_url   : URL string | null  (Cloudinary)
├── status      : enum { DRAFT, PUBLISHED }
├── created_at  : timestamp
└── updated_at  : timestamp
```

#### Submission
Pendaftaran seorang peserta ke sebuah campaign. Tidak memerlukan akun — cukup nama, email, dan nomor HP.

```
Submission
├── id          : UUID (PK)
├── campaign_id : UUID (FK → Campaign.id)
├── name        : string
├── email       : string
├── phone       : string | null
└── created_at  : timestamp
```

---

### Relasi Antar Entitas

```
User ──────────────────────────────── (tidak ada relasi langsung ke Campaign/Submission)
                                       Admin mengelola Campaign melalui Dolphin (tidak disimpan sebagai FK)

Campaign ──────────────── 1 : N ────── Submission
   Satu campaign bisa memiliki banyak submission pendaftaran
```

---

## 4. ERD (Entity Relationship Diagram)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          PEGASUS — ERD                                       │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────┐              ┌──────────────────────────────────┐
│            USER             │              │           CAMPAIGN               │
├─────────────────────────────┤              ├──────────────────────────────────┤
│ PK  id           UUID       │              │ PK  id           UUID            │
│     name         VARCHAR    │              │     name         VARCHAR(255)    │
│     email        VARCHAR    │◄────oper.────│     slug         VARCHAR(255)    │
│     password_hash VARCHAR   │  (no FK,     │     description  TEXT            │
│     role         ENUM       │   admin      │     image_url    VARCHAR         │
│     is_active    BOOLEAN    │   manages    │     status       ENUM            │
│     created_at   TIMESTAMP  │   via UI)    │     created_at   TIMESTAMP       │
│     updated_at   TIMESTAMP  │              │     updated_at   TIMESTAMP       │
└─────────────────────────────┘              └──────────────┬───────────────────┘
                                                            │
                                                          1 │
                                                            │
                                                          N │
                                             ┌──────────────▼───────────────────┐
                                             │          SUBMISSION              │
                                             ├──────────────────────────────────┤
                                             │ PK  id           UUID            │
                                             │ FK  campaign_id  UUID ──► Campa. │
                                             │     name         VARCHAR         │
                                             │     email        VARCHAR         │
                                             │     phone        VARCHAR         │
                                             │     created_at   TIMESTAMP       │
                                             └──────────────────────────────────┘

Enums:
  UserRole      : ADMIN | USER
  CampaignStatus: DRAFT | PUBLISHED
```

---

## 5. Flowchart

### A. Alur Pendaftaran Peserta (Falcon)

```
[Pengunjung membuka website]
         │
         ▼
[Halaman Utama — HeroSection, ProductSection, FormSection]
         │
         ├──► [Klik campaign card] ──► [Halaman /campaign/:slug]
         │                                     │
         │                            [Lihat detail campaign]
         │                                     │
         └──► [FormSection / Halaman detail] ◄─┘
                        │
              [Isi form: Nama, Email, No.HP]
                        │
               [Klik tombol Daftar]
                        │
                        ▼
          [GraphQL Mutation: submitRegistration]
                        │
               ┌────────▼────────┐
               │  Campaign Ada?   │
               └────────┬────────┘
                   Yes  │  No
                        │  └──► [Error: Campaign tidak ditemukan]
                        ▼
          [Submission disimpan ke DB]
                        │
                        ▼
        [Email konfirmasi dikirim (fire-and-forget)]
                        │
                        ▼
        [Tampilkan pesan sukses ke pengunjung]
```

---

### B. Alur Manajemen Campaign (Dolphin — Admin)

```
[Admin membuka /login]
         │
[Masukkan email & password]
         │
         ▼
[GraphQL Mutation: login]
         │
    ┌────▼────┐
    │  Valid? │
    └────┬────┘
    No   │  Yes
    │    ▼
    │  [JWT token disimpan]
    │  [Redirect ke /campaigns]
    ▼
[Tampilkan error]

[Di halaman /campaigns]
         │
         ├──► [Klik "+ Tambah Campaign"]
         │              │
         │     [Buka CampaignFormDialog]
         │     [Isi: nama, slug, deskripsi, gambar, status]
         │              │
         │     [Submit → createCampaign mutation]
         │              │
         │     [Campaign tersimpan → refetch list]
         │
         ├──► [Klik Edit (ikon pensil)]
         │              │
         │     [Buka CampaignFormDialog dengan data existing]
         │     [Edit field yang diinginkan]
         │              │
         │     [Submit → updateCampaign mutation]
         │              │
         │     [Campaign diperbarui → refetch list]
         │
         └──► [Klik Delete (ikon hapus)]
                        │
              [ConfirmDialog muncul]
                        │
              [Konfirmasi → deleteCampaign mutation]
                        │
              [Campaign dihapus → refetch list]
```

---

### C. Alur Manajemen User & Role (Dolphin — Admin)

```
[Admin di /users]
         │
         ├──► [Filter: All / Admin / User]
         │
         ├──► [Klik "+ Tambah User"]
         │              │
         │     [Buka UserFormDialog]
         │     [Isi: nama, email, password, role]
         │     [createUser mutation]
         │
         ├──► [Klik Edit User]
         │     [updateUser mutation — bisa ubah role, status]
         │
         └──► [Klik Delete / Deactivate]
                [deleteUser / deactivateUser mutation]
```

---

### D. GraphQL Request Lifecycle (Phoenix)

```
[Client Apollo — Falcon/Dolphin]
         │
         │  HTTP POST /graphql
         ▼
[NestJS Apollo Server]
         │
         ├──► [Guard: JwtAuthGuard (jika @UseGuards)]
         │           │
         │    ┌──────▼──────┐
         │    │ Token valid?│
         │    └──────┬──────┘
         │       No  │  Yes
         │       │   └──► [Inject user ke context]
         │       ▼
         │    [UnauthorizedException]
         │
         ▼
[Resolver (GraphQL endpoint handler)]
         │
         ▼
[Service (business logic)]
         │
         ├──► [Repository (database query)]
         │           │
         │           ▼
         │    [PostgreSQL — Zod validation]
         │           │
         │           ▼
         │    [Return entity / DRO]
         │
         └──► [MailService (email, fire-and-forget)]
         │
         ▼
[Return GraphQL response ke client]
```

---

## 6. Scalability

### Kondisi saat ini (MVP)

Platform ini berjalan dengan baik untuk skala kecil-menengah. Jika jumlah campaign dan pendaftaran bertambah signifikan, berikut perbaikan yang direkomendasikan:

---

### Jika campaign bertambah banyak

**Problem:** Query `campaigns` mengembalikan semua data sekaligus.

**Solusi:**
- Tambahkan **pagination** (offset/cursor-based) pada query `campaigns`
- Tambahkan **full-text search** dengan PostgreSQL `tsvector` atau integrasi Elasticsearch
- Tambahkan **filter & sort** parameter (by status, date, name)

```graphql
# Contoh query dengan pagination
campaigns(status: PUBLISHED, page: 1, limit: 12): CampaignListDro
```

---

### Jika submission membludak (event viral)

**Problem:** `submitRegistration` langsung tulis ke DB dan kirim email — bottleneck saat ribuan request bersamaan.

**Solusi:**
- Pisahkan email dari flow submission dengan **message queue** (BullMQ / RabbitMQ)
- Submit → tulis ke DB → push job ke queue → worker proses email async
- Tambahkan **rate limiting** per IP/email untuk mencegah spam registrasi

---

### Jika load tinggi secara keseluruhan

**Problem:** Satu instance Phoenix menangani semua traffic.

**Solusi:**
- **Horizontal scaling** Phoenix di belakang load balancer (NGINX / AWS ALB)
- **Caching** dengan Redis: cache hasil query `campaignBySlug` (data jarang berubah)
- **CDN** untuk aset statis Falcon (gambar, CSS, JS) — Cloudflare / Vercel Edge

---

### Jika fitur bertambah kompleks

| Kebutuhan | Solusi |
|-----------|--------|
| Multi-tenant (banyak organizer) | Tambah `organization_id` di Campaign, tenant-based auth |
| Analytics submission per campaign | Tabel `submission_stats` dengan agregasi terjadwal |
| Upload gambar masif | Lazy upload ke Cloudinary via signed URL, bukan server proxy |
| Audit log perubahan | Tambah tabel `audit_log` (who changed what, when) |
| Notifikasi real-time | WebSocket / GraphQL Subscription untuk live submission count |

---

## 7. Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 9
- PostgreSQL (running)
- `.env` files di setiap app (lihat `.env.example`)

### Install & Run

```bash
# Install semua dependencies | Gunakan PNPM agar tidak merubah pipeline 
pnpm install

# Jalankan semua apps sekaligus (dev mode)
pnpm dev

# Atau jalankan per app
pnpm --filter phoenix dev   # Backend API     → http://localhost:4000/graphql
pnpm --filter dolphin dev   # Admin Dashboard → http://localhost:3000
pnpm --filter falcon dev    # Public Website  → http://localhost:3001
```

### Run Tests (Phoenix)

```bash
pnpm --filter phoenix test
pnpm --filter phoenix test:cov
```

### Build Production

```bash
pnpm build
```

---

## Project Structure

```
pegasus/
├── apps/
│   ├── phoenix/          # NestJS GraphQL Backend
│   │   └── src/
│   │       ├── auth/         # Authentication (JWT)
│   │       ├── user/         # User management
│   │       ├── campaign/     # Campaign management
│   │       ├── submission/   # Event registration
│   │       ├── admin/        # Admin ops & stats
│   │       ├── mail/         # Email notifications
│   │       └── upload/       # File upload (Cloudinary)
│   │
│   ├── dolphin/          # Admin Dashboard (Next.js)
│   │   ├── app/
│   │   │   ├── login/        # Login page
│   │   │   ├── register/     # Register page
│   │   │   ├── campaigns/    # Campaign management
│   │   │   └── users/        # User management
│   │   └── components/
│   │       ├── atoms/
│   │       ├── molecules/
│   │       ├── organisms/    # CampaignTable, UserTable, Dialogs
│   │       ├── templates/    # AdminLayout
│   │       └── providers/    # Apollo, Auth, MUI
│   │
│   └── falcon/           # Public Website (Next.js)
│       ├── app/
│       │   ├── page.tsx          # Landing page
│       │   ├── jadwal/           # Event schedule
│       │   └── campaign/[slug]/  # Campaign detail & registration
│       └── components/
│           ├── atoms/
│           ├── molecules/
│           └── organisms/    # HeroSection, ProductSection, FormSection
│
├── turbo.json            # Turbo pipeline config
├── pnpm-workspace.yaml   # pnpm workspace
└── package.json
```

---

*Pegasus — Built for Japan Fest 2026*

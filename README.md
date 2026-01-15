# Kru Jeab

LINE LIFF Application สำหรับบันทึกรายรับรายจ่าย พัฒนาด้วย Next.js และ Prisma

## Tech Stack

- **Framework:** Next.js 16
- **Database:** SQLite (with Prisma ORM + better-sqlite3 adapter)
- **Styling:** TailwindCSS 4
- **LINE Integration:** LIFF SDK

## Prerequisites

- Node.js 20+
- pnpm

## Getting Started

### 1. Clone และติดตั้ง dependencies

```bash
git clone <repository-url>
cd kru-jeab
pnpm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ที่ root ของโปรเจค:

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_LIFF_ID="your-liff-id"
```

### 3. ตั้งค่า Database

```bash
# สร้าง migration และ database
pnpm db:migrate

# หรือ push schema โดยไม่สร้าง migration file
pnpm db:push

# สร้าง Prisma Client
pnpm db:generate
```

### 4. รัน Development Server

```bash
pnpm dev
```

เปิด [http://localhost:3000](http://localhost:3000) ใน browser

## Scripts

| คำสั่ง | คำอธิบาย |
|--------|----------|
| `pnpm dev` | รัน development server |
| `pnpm build` | build สำหรับ production |
| `pnpm start` | รัน production server |
| `pnpm lint` | ตรวจสอบ code ด้วย ESLint |

### Database Scripts

| คำสั่ง | คำอธิบาย |
|--------|----------|
| `pnpm db:generate` | สร้าง Prisma Client จาก schema |
| `pnpm db:migrate` | สร้าง migration ใหม่ (development) |
| `pnpm db:migrate:deploy` | apply migrations (production) |
| `pnpm db:push` | sync schema ไป database โดยไม่สร้าง migration |
| `pnpm db:studio` | เปิด Prisma Studio GUI ดูข้อมูลใน database |
| `pnpm db:seed` | ใส่ข้อมูลตัวอย่าง |
| `pnpm db:reset` | reset database และรัน migrations ใหม่ |

## Project Structure

```
kru-jeab/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Migration files
├── src/
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   ├── configs/           # Configuration files
│   ├── contexts/          # React contexts (LIFF)
│   ├── generated/         # Generated Prisma Client
│   ├── interfaces/        # TypeScript interfaces
│   ├── libs/              # Utility libraries
│   └── services/          # API services
├── public/                # Static files
└── .env                   # Environment variables
```

## Database Schema

### User
| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (CUID) |
| lineId | String | LINE User ID (unique) |
| name | String? | ชื่อผู้ใช้ |
| createdAt | DateTime | วันที่สร้าง |

### Transaction
| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (CUID) |
| userId | String | Foreign key to User |
| type | TxnType | INCOME / EXPENSE |
| amount | Int | จำนวนเงิน |
| note | String? | หมายเหตุ |
| category | String? | หมวดหมู่ |
| createdAt | DateTime | วันที่สร้าง |

## Development

### ดูข้อมูลใน Database

```bash
pnpm db:studio
```

จะเปิด browser ที่ http://localhost:5555

### แก้ไข Database Schema

1. แก้ไขไฟล์ `prisma/schema.prisma`
2. รัน migration:
   ```bash
   pnpm db:migrate --name <migration-name>
   ```
3. Prisma Client จะ generate ให้อัตโนมัติ

## Deployment

### Build

```bash
pnpm build
```

### Production

```bash
pnpm db:migrate:deploy  # apply migrations
pnpm start
```

## License

Private

# News Portal

Next.js 14 news website with a mobile-friendly admin panel (shadcn/ui), TipTap editor, Cloudinary uploads, charts, dark mode, and toasts.

**Repo:** https://github.com/raficowm-creator/news-portal

## New packages (already in package.json)

Install everything with:

```bash
npm install
```

These were added for the admin upgrade:

```bash
npm install class-variance-authority clsx tailwind-merge lucide-react tailwindcss-animate next-themes react-hot-toast recharts cloudinary @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slot @radix-ui/react-switch @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder

npm install -D @tailwindcss/typography
```

## Environment variables

Copy `.env.example` to `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-strong-secret"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

Get Cloudinary keys from [cloudinary.com](https://cloudinary.com) → Dashboard.

## Setup

```bash
npm install
cp .env.example .env
npx prisma db push
npx prisma db seed
npm run dev
```

Default admin: `admin@example.com` / `admin123`

## Admin features

- Responsive shadcn/ui layout
- Mobile sidebar as a drawer (hamburger menu)
- TipTap rich text editor on article create/edit
- Cloudinary image upload (plus URL fallback)
- Dashboard charts (Recharts)
- Search, status filter, and pagination on articles
- Dark mode (next-themes)
- Success/error toasts (react-hot-toast)

## Prisma

`prisma/schema.prisma` uses **PostgreSQL**. Set `DATABASE_URL` to a Postgres/Neon connection string before `prisma db push`.

# News Portal

A complete Next.js news website with:

- Public news homepage, category pages, article pages, search
- User login / register (NextAuth credentials)
- Admin panel to manage articles, categories, and users
- Prisma + SQLite database, Tailwind CSS, TypeScript

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- NextAuth v4 (Credentials)
- Prisma ORM + SQLite
- Zod validation
- Server Actions for admin CRUD

## Setup

1. Clone the repository

```bash
git clone https://github.com/raficowm-creator/news-portal.git
cd news-portal
```

2. Install dependencies

```bash
npm install
```

3. Create environment file

```bash
cp .env.example .env
```

Edit `.env` and set a strong `NEXTAUTH_SECRET` (you can generate one with `openssl rand -base64 32`).

4. Initialize the database and seed data

```bash
npx prisma db push
npx prisma db seed
# or: npm run db:seed
```

5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Default Admin Credentials

```
Email: admin@example.com
Password: admin123
```

## Project Structure

```
news-portal/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── articles/[slug]/page.tsx
│   │   │   ├── category/[slug]/page.tsx
│   │   │   ├── search/page.tsx
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── articles/
│   │   │   ├── categories/
│   │   │   └── users/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   └── register/route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   └── actions/
│   ├── middleware.ts
│   └── types/next-auth.d.ts
├── .env.example
├── package.json
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── next.config.js
```

## Features

### Public
- Homepage with featured + latest articles
- Category listing pages
- Individual article pages
- Search
- Login / Register

### Admin (role-protected)
- Dashboard with counts
- CRUD for Articles
- CRUD for Categories
- View users and change roles (USER / ADMIN)

## Production Notes

- Sanitize HTML content before rendering (e.g. with `sanitize-html`)
- Prefer PostgreSQL over SQLite for production
- Use a proper secret for `NEXTAUTH_SECRET`
- Add image upload support instead of URL-only
- Add pagination, rate limiting, and a rich text editor as needed

## License

MIT

# RMU SRC — Students' Representative Council Website

Public, read-only site (Home, About, Executives, News, Events, Marketplace, Student Services,
Constitution, Contact) with an admin-only login for managing all content. Marketplace purchases
go through Paystack; the SRC (only admins) lists items, students buy directly — no student
accounts needed.

## Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + lucide-react, single `client/src/api.js` for all API calls
- **Backend**: Node + Express (ESM), JWT auth (jsonwebtoken + bcryptjs), Multer → Cloudinary uploads, Resend emails
- **Database**: PostgreSQL (Neon), `schema.sql` + `seed.js`
- **Payments**: Paystack (public key on client, secret key verified server-side)
- **Deploy**: single Render web service serving the built frontend + API

## 1. Install

```bash
git clone <this repo>
cd rmu-src
npm install
```

This installs both workspaces (`client` and `server`) via npm workspaces.

## 2. Environment variables

```bash
cp .env.example .env          # fill in server values
cp client/.env.example client/.env   # fill in VITE_PAYSTACK_PUBLIC_KEY
```

You'll need:
- A **Neon** Postgres connection string → `DATABASE_URL`
- A **Cloudinary** account (cloud name, API key/secret) for image/PDF uploads
- A **Resend** API key + verified sender for password-reset and order-confirmation emails
- A **Paystack** account: secret key on the server, public key (`VITE_PAYSTACK_PUBLIC_KEY`) on the client

## 3. Set up the database

```bash
npm run seed --workspace server
```

This runs `schema.sql` against your Neon database and creates the first admin user from
`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env` (defaults to `admin@rmu.edu.gh` /
`ChangeMe123!` — change this before going live).

## 4. Run locally

```bash
npm run dev:all
```

- Client: http://localhost:5173
- Server: http://localhost:5000 (health check at `/api/health`)
- Vite proxies `/api/*` to the server automatically (see `client/vite.config.js`), so the
  frontend's `api.js` just calls relative `/api/...` paths in both dev and prod.

Log in to the admin area at **http://localhost:5173/admin/login** with the seeded credentials.

## 5. Deploy to Render

1. Push this repo to GitHub.
2. In Render, "New +" → "Blueprint" → point it at the repo (it will read `render.yaml`).
3. Fill in the environment variables Render prompts for (all the `sync: false` ones — database
   URL, JWT secret, Cloudinary, Resend, Paystack, `CLIENT_URL`, `VITE_PAYSTACK_PUBLIC_KEY`).
4. Deploy. Render will run `npm install && npm run build` (builds the client into
   `client/dist`) then `npm run start` (Express serves the API and the built frontend from one
   process).
5. Run the seed script once against your production database (e.g. from your local machine with
   `DATABASE_URL` pointed at Neon prod, or via a Render shell): `npm run seed --workspace server`.

## Project structure

```
rmu-src/
├── render.yaml
├── .env.example
├── client/                # React + Vite + Tailwind
│   └── src/
│       ├── api.js         # every frontend → backend call lives here
│       ├── App.jsx
│       ├── components/    # Navbar, Footer, CheckoutModal, ProtectedRoute
│       └── pages/         # Home, About, Executives, News, Events, Marketplace,
│                           # StudentServices, Constitution, Contact, admin/*
└── server/                # Express (ESM)
    ├── schema.sql
    ├── src/
    │   ├── index.js       # app entry, mounts routes, serves client/dist in prod
    │   ├── db.js           # pg pool + query() helper
    │   ├── seed.js
    │   ├── middleware/authMiddleware.js
    │   ├── utils/          # cloudinary.js, email.js, paystack.js
    │   └── routes/         # auth, executives, news, events, marketplace,
    │                        # orders, contact, upload, settings
```

## What's built vs. what's next

**Fully wired (public + API)**: Home, About/impact stats, Executives, News (list + detail),
Events, Marketplace with live Paystack checkout, Student Services, Constitution, Contact form.

**Admin**: login, forgot/reset password, full CRUD screens (create, edit, delete, with image
upload via Cloudinary) for News, Events, Executives, and Marketplace items, plus an overview
dashboard showing contact messages and marketplace orders.

**Not built yet**: admin screens for editing the About-page impact stats, industry partners,
student services list, and the constitution PDF — the API routes for all of these already exist
in `server/src/routes/settings.js` (`/api/settings/*`, `/partners`, `/services`,
`/constitution`) and just need forms wired up the same way the other admin pages are.

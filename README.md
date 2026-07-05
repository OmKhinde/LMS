# LMS Quick Start + Deploy

Stack: React (Vite) + Node/Express + MongoDB + Clerk + Stripe + Cloudinary

Detailed docs: see `README.full.md`.

## 1) Prerequisites

- Node.js 18+
- npm 9+
- MongoDB URI
- Clerk app keys
- Stripe keys + webhook secret
- Cloudinary credentials

## 2) Environment

Create `server/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster-host>
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
CLERK_SECRET_KEY=sk_test_xxx
CLERK_WEBHOOK_SECRET=whsec_xxx
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
CURRENCY=usd
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

Create `client/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
VITE_BACKEND_URL=http://localhost:5000
VITE_CURRENCY=USD
```

## 3) Run Locally

```bash
cd client && npm install
cd ../server && npm install
```

Terminal 1:

```bash
cd server
npm run dev
```

Terminal 2:

```bash
cd client
npm run dev
```

URLs:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health: http://localhost:5000/health

## 4) Core Scripts

- Root: `npm run build`, `npm start`
- Client: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`
- Server: `npm run dev`, `npm start`

## 5) Deploy (Fast Path)

1. Deploy `server/` to a Node host (Vercel/Render/Railway).
2. Set all server env vars in hosting dashboard.
3. Deploy `client/` as a Vite static app.
4. Set `VITE_BACKEND_URL` to your deployed backend URL.
5. Set backend `CLIENT_URL` to your deployed frontend URL.
6. Configure webhooks:
   - Clerk -> `https://<backend-domain>/clerk`
   - Stripe -> `https://<backend-domain>/stripe`
7. Update webhook secrets in backend env and redeploy.

Note: `server/versel.json` is misspelled. Rename to `server/vercel.json` if deploying backend on Vercel.

## 6) Common Issues

- Startup env validation fails: check missing keys in `server/.env`
- CORS errors: mismatch between `CLIENT_URL` and deployed frontend origin
- Stripe signature error: wrong `STRIPE_WEBHOOK_SECRET`
- Role route forbidden: incorrect Clerk metadata role
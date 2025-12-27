# LMS Fullstack Project

A full-stack Learning Management System (LMS) built with a React + Vite client and an Express + MongoDB backend. It supports student learning, educator course management, and admin controls, with authentication via Clerk and payments via Stripe.

---

## Tech Stack

- **Client**
  - React (Vite)
  - React Router
  - Tailwind CSS
  - Axios
  - Quill (rich text editor)
  - React Toastify, React YouTube, etc.

- **Server**
  - Node.js + Express
  - MongoDB + Mongoose
  - Clerk (auth)
  - Stripe (payments) + Svix (webhooks)
  - Cloudinary (media storage)
  - Multer (file uploads)
  - CORS, dotenv

---

## Project Structure

- [client](client)
  - React front-end (students, educators, admin UI)
  - Pages for students, educators, admin (e.g. dashboard, courses, enrollments)
  - Global context in `context/AppContext.jsx`
- [server](server)
  - Express API and webhook handlers
  - `configs/` – MongoDB, Cloudinary, Multer config
  - `models/` – User, Course, CourseProgress, Purchase, EducatorApplication
  - `controllers/` – business logic for users, courses, admin, applications, webhooks
  - `routes/` – `userRouter`, `courseRouter`, `educatorRoutes`, `adminRoutes`
  - `middlewares/` – auth middleware, error handler

The server also serves the built client from `client/dist` in production.

---

## Prerequisites

- Node.js (LTS)
- npm
- MongoDB instance (Atlas or self-hosted)
- Cloudinary account
- Stripe account
- Clerk project (for authentication)

---

## Environment Variables

Create a `.env` file in the `server` directory with at least:

```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string-without-db-name>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Clerk (example names – match how you wire them in controllers/webhooks)
CLERK_SECRET_KEY=<your-clerk-secret-key>
CLERK_WEBHOOK_SECRET=<your-clerk-webhook-secret>

# Stripe
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
```

Adjust or add any additional keys used in the controllers (Stripe, Clerk, etc.).

MongoDB is configured in `configs/mongodb.js` to connect using:

```js
mongoose.connect(`${process.env.MONGO_URI}/lms`)
```

So `MONGO_URI` should be just the server/cluster URI, without the `/lms` suffix.

---

## Installation & Setup

From the project root:

1. **Install and build client** (handled by root build script):
   ```bash
   npm run build
   ```
   This will:
   - `cd client`
   - `npm install`
   - `npm run build` (outputs to `client/dist`)

2. **Install server dependencies** and start API:
   ```bash
   cd server
   npm install
   npm run server   # uses nodemon
   # or
   npm start        # plain node server.js
   ```

Alternatively, use the root `start` script to install and run the server from the project root:

```bash
npm run start
```

That script does:
- `cd server`
- `npm install`
- `node server.js`

---

## Running the Client in Development

When developing the frontend separately:

```bash
cd client
npm install
npm run dev
```

The client dev server will typically run at `http://localhost:5173` and is already allowed by the server CORS config.

---

## API Overview

Server entry: [server/server.js](server/server.js)

Key routes (all JSON-based unless specified):

- `GET /` – Health check (`"LMS API is working"`).
- Stripe webhooks:
  - `POST /stripe` – Stripe webhook endpoint (raw body).
  - `GET /stripe` – Stripe webhook readiness check.
- Clerk webhooks:
  - `POST /clerk` – Clerk webhook endpoint.

Versioned API routes:

- `/api/user` – user data, applications, course enrollments, ratings, purchases, progress.
- `/api/course` – course listing, details, and course-related actions.
- `/api/educator` – educator dashboards, course creation, student enrollment details.
- `/api/admin` – admin dashboards, course & user management, educator applications.

See the corresponding route files in [server/routes](server/routes) and controllers in [server/controllers](server/controllers) for exact endpoints.

---

## Frontend Features (Client)

- **Student**
  - Landing page: hero section, testimonials, companies, featured courses.
  - Browse courses, search, rating display.
  - Course detail page, player page, my enrollments.

- **Educator**
  - Apply as educator, view application status.
  - Dashboard for managing own courses.
  - Add courses with rich-text content and video, view students enrolled.

- **Admin**
  - Admin dashboard with overview.
  - Manage courses, students, educators.
  - Review educator applications.

Components and pages are under `client/src/components` and `client/src/pages` in `admin`, `educator`, and `student` subfolders.

---

## Production Deployment

1. Build the client:
   ```bash
   npm run build
   ```
2. Ensure `.env` is set on the server environment.
3. Start the server (`npm run start` from root, or `npm start` from server directory).
4. The Express server will serve static files from `client/dist` and fall back to `index.html` for SPA routing.


## Scripts Summary

From **project root**:

- `npm run build` – Install client deps and build Vite app.
- `npm run start` – Install server deps and start backend with Node.

From **client**:

- `npm run dev` – Vite dev server.
- `npm run build` – Production build.
- `npm run preview` – Preview production build.
- `npm run lint` – Run ESLint.

From **server**:

- `npm run server` – Start backend with nodemon (auto-restart on changes).
- `npm start` – Start backend with Node.

---

## Notes

- Ensure Clerk, Stripe, and webhook secrets are configured correctly where used in controllers/webhooks.
- Update CORS origins and any hard-coded URLs when changing domains or ports.
- For local development, the client typically runs at `http://localhost:5173` and server at `http://localhost:5000`.

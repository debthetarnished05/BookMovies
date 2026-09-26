## 🐳☁️ Render + Upstash + MongoDB Atlas Deployment Guide

This section explains how to deploy the BookMovies backend using **Render**, **MongoDB Atlas**, and **Upstash Redis**, while deploying the frontend separately on **Vercel**.

### Architecture

```text
                    ┌──────────────────┐
                    │      Vercel      │
                    │  React Frontend  │
                    └────────┬─────────┘
                             │
                             │ HTTPS API
                             ▼
                    ┌──────────────────┐
                    │      Render      │
                    │ Node + Express   │
                    │     Socket.IO    │
                    └───────┬──────────┘
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
        ┌─────────────────┐   ┌─────────────────┐
        │ MongoDB Atlas   │   │  Upstash Redis  │
        │ Persistent DB   │   │ Cache / Locks   │
        └─────────────────┘   └─────────────────┘

                    ┌─────────────────┐
                    │     Razorpay    │
                    │    Payments     │
                    └─────────────────┘
```

---

### Step 1: Create MongoDB Atlas Database

1. Create an account on **MongoDB Atlas**.
2. Create a new cluster.
3. Create a database user with a username and password.
4. Configure the network access settings to allow your Render service to connect.
5. Copy the MongoDB connection string.

It will look similar to:

```env
MONGO_CONNECTION_STRING=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```

Make sure the database name matches the one expected by your application.

---

### Step 2: Configure Upstash Redis

1. Create an account on **Upstash**.
2. Create a Redis database.
3. Select a region close to your application/users.
4. Copy the Redis connection details provided by Upstash.

Depending on how Redis is initialized in the application, your environment variables may look like:

```env
REDIS_HOST=<upstash-redis-host>
REDIS_PORT=6379
REDIS_PASSWORD=<upstash-redis-password>
```

If your application uses an Upstash Redis URL instead, configure the variable expected by your Redis client, for example:

```env
REDIS_URL=rediss://:<password>@<host>:6379
```

Use the exact variable names and connection format expected by your backend code.

---

### Step 3: Prepare the Backend

Make sure the backend can start using the production environment variables.

Inside the `server` directory:

```bash
npm install
```

Check that your `package.json` contains a production start script, for example:

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

Render will use:

```bash
npm start
```

Your Express server should also listen on the port supplied by Render:

```javascript
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Do **not** hard-code port `5000` for production.

---

### Step 4: Push the Backend to GitHub

Commit your backend code and push it to GitHub.

Make sure `.env` is included in `.gitignore`:

```gitignore
.env
node_modules/
```

Do **not** commit production credentials such as:

```env
MONGO_CONNECTION_STRING
REDIS_PASSWORD
RAZORPAY_API_KEY
RAZORPAY_SECRET
JWT_SECRET
```

---

### Step 5: Deploy Backend on Render

1. Create an account on Render.
2. Select **New → Web Service**.
3. Connect your GitHub repository.
4. Select the BookMovies repository.
5. Set the backend root directory to:

```text
server
```

6. Configure the service.

For example:

```text
Runtime: Node
Build Command: npm install
Start Command: npm start
```

Render will provide a URL similar to:

```text
https://bookmovies-backend.onrender.com
```

---

### Step 6: Add Environment Variables to Render

Open the Render service's **Environment Variables** section and add the variables required by the backend.

For example:

```env
NODE_ENV=production

MONGO_CONNECTION_STRING=mongodb+srv://...

REDIS_HOST=...
REDIS_PORT=6379
REDIS_PASSWORD=...

JWT_SECRET=...

RAZORPAY_API_KEY=...
RAZORPAY_SECRET=...

FRONTEND_URL=https://your-frontend.vercel.app
```

Also add any other variables required by the application, such as email/Nodemailer configuration.

**Never put these production credentials directly in the source code.**

---

### Step 7: MongoDB Atlas Network Access

Render does not have a single permanent IP address that you should rely on for this setup.

Configure MongoDB Atlas Network Access so that the Render service can connect.

For development/testing, you may temporarily allow access from anywhere:

```text
0.0.0.0/0
```

However, MongoDB credentials should still be protected with a strong database username and password.

For a production deployment, use the network/security configuration appropriate for your Atlas setup rather than unnecessarily exposing the database.

---

### Step 8: Seed the Database

If the project contains seed scripts for theaters, movies, and shows, you can run them against MongoDB Atlas.

For example:

```bash
npm run seed:theaters
npm run seed:movies
npm run seed:shows
```

Make sure the commands use the production `MONGO_CONNECTION_STRING`.

---

### Step 9: Deploy the Frontend on Vercel

Deploy the `client` directory to Vercel.

In the Vercel Environment Variables section, configure:

```env
VITE_API_URL=https://bookmovies-backend.onrender.com/api
```

If Socket.IO is configured separately, make sure its client-side connection URL also points to the Render backend.

For example:

```javascript
const socket = io(import.meta.env.VITE_API_URL);
```

or use the appropriate production backend URL based on your existing Socket.IO configuration.

---

### Step 10: Configure CORS

Since the frontend and backend are deployed on different services:

```text
Vercel
   ↓
Render
```

the backend must allow requests from the Vercel frontend.

For example:

```javascript
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);
```

Set:

```env
FRONTEND_URL=https://your-frontend.vercel.app
```

Do not use `*` when your application requires credentials/cookies.

---

### Step 11: Socket.IO Configuration

BookMovies uses Socket.IO for real-time seat availability.

The production architecture becomes:

```text
User 1
   │
   ▼
Vercel Frontend
   │
   │ WebSocket / HTTPS
   ▼
Render Backend
   │
   ├──── MongoDB Atlas
   │
   └──── Upstash Redis
```

The frontend should connect to the Render backend rather than:

```text
localhost:5000
```

For example:

```env
VITE_API_URL=https://bookmovies-backend.onrender.com/api
```

Make sure the Socket.IO server's CORS configuration also permits the Vercel frontend.

---

### Step 12: Production Flow

After deployment, the complete application works like this:

```text
                 ┌───────────────────┐
                 │      Vercel       │
                 │  React + Vite     │
                 └─────────┬─────────┘
                           │
                    HTTPS / Socket.IO
                           │
                           ▼
                 ┌───────────────────┐
                 │      Render       │
                 │ Node + Express    │
                 │     Socket.IO     │
                 └───────┬───────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
      ┌────────────────┐    ┌────────────────┐
      │ MongoDB Atlas  │    │ Upstash Redis  │
      │                │    │                │
      │ Users          │    │ Cache          │
      │ Movies         │    │ Seat locks     │
      │ Shows          │    │ Temporary data │
      │ Bookings       │    │                │
      └────────────────┘    └────────────────┘

                         │
                         ▼
                  ┌──────────────┐
                  │   Razorpay   │
                  │   Payments   │
                  └──────────────┘
```

### Service Responsibilities

| Service           | Responsibility                                |
| ----------------- | --------------------------------------------- |
| **Vercel**        | React frontend hosting                        |
| **Render**        | Node.js/Express backend + Socket.IO           |
| **MongoDB Atlas** | Persistent application data                   |
| **Upstash Redis** | Caching, temporary data, seat-locking support |
| **Razorpay**      | Payment processing                            |
| **Nodemailer**    | Booking confirmation emails                   |

---

### Important Production Changes

Before deploying, make sure the application does not contain development-only values such as:

```text
localhost:5000
localhost:27017
localhost:6379
```

Replace them with environment variables.

For example:

```javascript
const API_URL = process.env.VITE_API_URL;
```

and:

```javascript
const PORT = process.env.PORT || 5000;
```

The final deployment therefore does **not require Docker or an AWS EC2 server**.

The backend runs on **Render**, persistent application data is stored in **MongoDB Atlas**, Redis is provided by **Upstash**, and the React frontend is hosted on **Vercel**.

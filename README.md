# BookMovies 🎬🍿

A full-stack movie ticket booking application built with the **MERN stack (MongoDB, Express, React, Node.js)**, **Redis**, and **Socket.IO** for real-time seat availability and updates.

BookMovies allows users to browse movies, theaters, and shows, select seats, make payments, and manage their bookings. Redis is used for caching and temporary seat-locking support, while Socket.IO provides real-time seat availability updates.

---

## 🚀 Features

### 🔐 User Authentication

* JWT-based authentication
* Secure login and registration
* Protected API routes
* User-specific bookings

### 🎬 Browse & Book Movies

* Browse available movies
* View theaters
* View upcoming shows
* Select seats
* Book movie tickets
* View booking information

### 💺 Real-Time Seat Availability

* Real-time seat availability using Socket.IO
* Live updates between connected users
* Redis-based temporary seat locking
* Helps prevent multiple users from attempting to book the same seat simultaneously

### 💳 Payment Integration

* Razorpay payment integration
* Secure payment processing
* Payment verification
* Booking confirmation after successful payment

### ⚡ Caching

* Redis-based caching
* Faster retrieval of frequently accessed data
* Temporary data storage
* Support for seat-locking mechanisms

### 👨‍💼 Admin Functionality

* Role-based access control
* Admin-specific show management
* Manage movies and shows
* View bookings associated with shows

### 🗄️ Database

* MongoDB with Mongoose
* MongoDB Atlas for production deployment
* MongoDB replica-set support where transactions are required

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │       Vercel        │
                         │   React Frontend    │
                         │ React + Vite        │
                         └──────────┬──────────┘
                                    │
                         HTTPS / Socket.IO
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       Render        │
                         │ Node.js + Express   │
                         │      Socket.IO      │
                         └──────────┬──────────┘
                                    │
                      ┌─────────────┴─────────────┐
                      │                           │
                      ▼                           ▼
             ┌─────────────────┐        ┌─────────────────┐
             │  MongoDB Atlas  │        │  Upstash Redis  │
             │                 │        │                 │
             │ Users           │        │ Cache           │
             │ Movies          │        │ Seat Locks      │
             │ Theaters        │        │ Temporary Data  │
             │ Shows           │        │                 │
             │ Bookings        │        │                 │
             └─────────────────┘        └─────────────────┘

                         ┌─────────────────────┐
                         │      Razorpay       │
                         │      Payments       │
                         └─────────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* TailwindCSS
* React Query
* React Router
* Socket.IO Client

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Redis
* Socket.IO
* JWT
* Razorpay

## Infrastructure

* Render
* MongoDB Atlas
* Upstash Redis
* Vercel
* GitHub

---

# 📁 Project Structure

```text
BookMovies/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   └── ...
│   │
│   ├── public/
│   ├── .env
│   ├── package.json
│   └── vercel.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── seed/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

> Docker configuration can be retained for local development, but Docker and AWS EC2 are not required for the production deployment described below.

---

# ⚙️ Local Development Setup

## Prerequisites

Install:

* Node.js v18+
* npm
* MongoDB
* Redis

Alternatively, MongoDB and Redis can be run using Docker.

---

# 1. Clone the Repository

```bash
git clone https://github.com/debthetarnished05/BookMovies.git

cd BookMovies
```

---

# 2. Backend Setup

Navigate to the backend:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_CONNECTION_STRING=mongodb://127.0.0.1:27017/bookmovies

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:5173

RAZORPAY_API_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
```

Use the exact environment variable names expected by the backend implementation.

Start the backend:

```bash
npm run dev
```

The backend should be available at:

```text
http://localhost:5000
```

---

# 3. Seed the Database

If seed scripts are available in `package.json`, populate the database using:

```bash
npm run seed:theaters
npm run seed:movies
npm run seed:shows
```

Check `package.json` for the exact available seed commands.

---

# 4. Frontend Setup

Open another terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🔑 Environment Variables

## Backend

```env
PORT=5000

MONGO_CONNECTION_STRING=mongodb://127.0.0.1:27017/bookmovies

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:5173

RAZORPAY_API_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
```

## Frontend

```env
VITE_API_URL=http://localhost:5000/api
```

### Production frontend

```env
VITE_API_URL=https://bookmovies-backend.onrender.com/api
```

Do not commit `.env` files containing credentials.

---

# 🐳 Optional Docker Setup for Local Development

Docker can still be used locally to run MongoDB and Redis.

Start the containers:

```bash
docker compose up -d
```

Check running containers:

```bash
docker ps
```

Stop the containers:

```bash
docker compose down
```

Docker is **not required for the production deployment**.

---

# ☁️ Production Deployment

The production deployment uses:

* **Vercel** → React frontend
* **Render** → Node.js/Express backend
* **MongoDB Atlas** → MongoDB database
* **Upstash** → Redis
* **Razorpay** → Payments

```text
                    Internet
                       │
                       ▼
              ┌─────────────────┐
              │     Vercel      │
              │ React Frontend  │
              └────────┬────────┘
                       │
                       │ HTTPS / Socket.IO
                       ▼
              ┌─────────────────┐
              │     Render      │
              │ Node + Express  │
              │    Socket.IO    │
              └───────┬─────────┘
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
       MongoDB Atlas       Upstash Redis
       Persistent Data     Cache / Locks
```

---

# 🗄️ Step 1: Set Up MongoDB Atlas

1. Create a MongoDB Atlas account.
2. Create a cluster.
3. Create a database user.
4. Configure Network Access.
5. Copy the MongoDB connection string.

Example:

```env
MONGO_CONNECTION_STRING=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
```

Replace the placeholders with your Atlas credentials.

For production, use a strong database password and appropriate network restrictions.

---

# ⚡ Step 2: Set Up Upstash Redis

1. Create an Upstash account.
2. Create a Redis database.
3. Select an appropriate region.
4. Copy the Redis connection credentials.

Depending on the Redis client used in the backend, configuration may look like:

```env
REDIS_HOST=<upstash-host>
REDIS_PORT=6379
REDIS_PASSWORD=<upstash-password>
```

or:

```env
REDIS_URL=rediss://:<password>@<host>:6379
```

Use the format required by the Redis client in the project.

---

# 🚀 Step 3: Deploy Backend to Render

Push the project to GitHub:

```bash
git add .
git commit -m "Prepare backend for production"
git push
```

Then:

1. Log in to Render.
2. Select **New → Web Service**.
3. Connect your GitHub repository.
4. Select the BookMovies repository.
5. Set the Root Directory to:

```text
server
```

6. Select the Node.js runtime.

Set:

```text
Build Command:
npm install
```

and:

```text
Start Command:
npm start
```

Make sure `server/package.json` contains a production start script:

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

---

# 🔐 Step 4: Configure Render Environment Variables

In:

**Render → Service → Environment → Environment Variables**

add the production variables:

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

Do not commit these credentials to GitHub.

---

# 🔌 Step 5: Configure the Render Port

Render provides the application port through:

```javascript
process.env.PORT
```

Your backend should use:

```javascript
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Do not hard-code the production port.

---

# 🌐 Step 6: Deploy Frontend to Vercel

Deploy the `client` directory to Vercel.

Set the project root directory to:

```text
client
```

Add:

```env
VITE_API_URL=https://bookmovies-backend.onrender.com/api
```

Replace the URL with your actual Render backend URL.

---

# 🔄 Step 7: Configure CORS

Because the frontend and backend are hosted separately, configure CORS in Express.

Example:

```javascript
import cors from "cors";

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

---

# 💺 Real-Time Seat Availability

BookMovies uses Socket.IO for real-time seat updates.

```text
User A                    User B
   │                         │
   │ Select A10              │
   ▼                         │
┌─────────────────────────────────┐
│          Render Backend          │
│            Socket.IO             │
└───────────────┬─────────────────┘
                │
                ▼
             Redis
                │
                ▼
        Seat availability
                │
        ┌───────┴───────┐
        ▼               ▼
     User A           User B
```

When a seat changes state, connected clients can receive the update without repeatedly refreshing the page.

---

# 🔒 Redis Seat Locking

Redis can be used to temporarily lock a seat while a user completes the booking process.

Example:

```text
User A selects A10
        │
        ▼
Redis locks A10
        │
        ▼
User A completes booking/payment
        │
        ▼
Booking confirmed
        │
        ▼
Lock released
```

If another user attempts to select the same seat while it is locked:

```text
User B
  │
  ▼
Try A10
  │
  ▼
Redis
  │
  ▼
A10 already locked
  │
  ▼
Reject / refresh seat status
```

A TTL can be applied to temporary locks so that abandoned seats automatically become available after the lock expires.

Redis locking should complement the application's final database-level booking and consistency checks.

---

# 💳 Razorpay Payment Flow

The general payment flow is:

```text
User
 │
 ▼
Select Movie + Show + Seats
 │
 ▼
Backend
 │
 ▼
Create Razorpay Order
 │
 ▼
Razorpay Checkout
 │
 ▼
Payment
 │
 ▼
Payment Verification
 │
 ▼
Confirm Booking
 │
 ▼
MongoDB Atlas
```

The Razorpay secret must remain on the backend.

Never expose:

```text
RAZORPAY_SECRET
JWT_SECRET
MONGO_CONNECTION_STRING
REDIS_PASSWORD
```

to the frontend.

---

# 🧠 Redis Caching

Frequently accessed data can be cached using Redis.

```text
GET /api/movies
       │
       ▼
    Backend
       │
       ▼
   Check Redis
     /     \
   HIT     MISS
    │        │
    ▼        ▼
 Return    MongoDB
            │
            ▼
          Redis
            │
            ▼
          Return
```

This reduces unnecessary database queries for frequently requested data.

---

# 📊 Production Services

| Service           | Purpose                                        |
| ----------------- | ---------------------------------------------- |
| **Vercel**        | React frontend hosting                         |
| **Render**        | Node.js/Express backend                        |
| **MongoDB Atlas** | Persistent database                            |
| **Upstash Redis** | Cache, temporary data and seat-locking support |
| **Razorpay**      | Payment processing                             |
| **Socket.IO**     | Real-time communication                        |
| **GitHub**        | Source code repository                         |

---

# 🔒 Security Considerations

* Store secrets in environment variables.
* Never commit `.env` files.
* Never expose Razorpay secrets to the frontend.
* Use a strong JWT secret.
* Use HTTPS in production.
* Configure CORS correctly.
* Validate user input on the backend.
* Protect admin routes with authorization middleware.
* Use secure MongoDB credentials.
* Use appropriate MongoDB Atlas network access rules.
* Set appropriate Redis TTLs for temporary locks.
* Verify Razorpay payments on the server.
* Do not trust payment information supplied directly by the client.

---

# 🧪 Testing Locally

Start MongoDB and Redis.

Then start the backend:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd client
npm run dev
```

Open:

```text
http://localhost:5173
```

Test:

* User registration
* Login
* Movie browsing
* Theater browsing
* Show selection
* Seat selection
* Real-time seat updates
* Booking
* Payment
* Admin functionality

---

# 🐛 Troubleshooting

## Backend cannot connect to MongoDB

Check:

```env
MONGO_CONNECTION_STRING
```

Make sure:

* MongoDB is running locally, or
* MongoDB Atlas is accessible
* Credentials are correct
* Database network access is configured

---

## Redis connection error

Check:

```env
REDIS_HOST
REDIS_PORT
REDIS_PASSWORD
```

For Upstash, make sure the connection uses the credentials provided by Upstash and supports TLS where required.

---

## CORS error

Check:

```env
FRONTEND_URL=https://your-frontend.vercel.app
```

Make sure the URL matches the deployed frontend origin.

---

## Socket.IO not connecting

Check that:

1. The frontend connects to the Render backend.
2. Socket.IO CORS allows the Vercel domain.
3. The Render backend is running.
4. The production URL is not pointing to `localhost`.

---

## Payment not working

Check:

```env
RAZORPAY_API_KEY
RAZORPAY_SECRET
```

Make sure the Razorpay credentials correspond to the environment being used.

---

# 📌 Useful Commands

## Backend

```bash
cd server
npm install
npm run dev
npm start
```

## Frontend

```bash
cd client
npm install
npm run dev
npm run build
```

## Docker — Optional Local Development

```bash
docker compose up -d
docker compose down
docker ps
```

## Git

```bash
git status
git add .
git commit -m "Update BookMovies"
git push
```

---

# 🌍 Deployment Summary

```text
┌───────────────────────────────────────────────┐
│                    USER                       │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │      Vercel      │
              │ React + Vite     │
              └────────┬─────────┘
                       │
                       │ HTTPS / Socket.IO
                       ▼
              ┌──────────────────┐
              │     Render       │
              │ Node + Express   │
              │    Socket.IO     │
              └───────┬──────────┘
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
    ┌───────────────┐    ┌───────────────┐
    │ MongoDB Atlas │    │ Upstash Redis │
    │               │    │               │
    │ Persistent    │    │ Cache         │
    │ Data          │    │ Seat Locks    │
    │               │    │ Temporary     │
    └───────────────┘    └───────────────┘
             │
             ▼
      ┌──────────────┐
      │   Razorpay   │
      │   Payments   │
      └──────────────┘
```

---

# 📜 License

This project is licensed under the **ISC License**.

---

# 👨‍💻 Author

**Debdeep Mazumder**

GitHub:
https://github.com/debthetarnished05/BookMovies

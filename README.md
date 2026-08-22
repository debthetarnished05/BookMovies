# BookMovies 🎬🍿

A full-stack movie ticket booking application built with the MERN stack (MongoDB, Express, React, Node.js), Redis, and Socket.io for real-time seat availability and updates. 

## 🚀 Features
- **User Authentication:** Secure JWT-based authentication.
- **Browse & Book Movies:** View theaters, movies, and upcoming shows. Book tickets seamlessly.
- **Real-Time Updates:** Live seat availability updates using Socket.io to prevent double-booking.
- **Payment Integration:** Secure payments via Razorpay.
- **Email Notifications:** Booking confirmations sent via email using Nodemailer & MJML.
- **Caching:** Redis for optimized data retrieval and performance.

## 💻 Tech Stack
- **Frontend (Client):** React, Vite, TailwindCSS, React Query, React Router, Socket.io-client
- **Backend (Server):** Node.js, Express, MongoDB (Mongoose), Redis, Socket.io, Razorpay, JWT
- **Infrastructure:** Docker, Docker Compose, AWS EC2, Vercel

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose (optional but recommended for running Redis/Mongo easily)
- MongoDB & Redis (if running locally without Docker)

### 1. Clone the Repository
```bash
git clone https://github.com/debthetarnished05/BookMovies.git
cd BookMovies
```

### 2. Backend Setup
```bash
cd server
npm install
```
- Create a `.env` file in the `server` directory (refer to `.env.example` if available). 
- Ensure variables like `MONGO_CONNECTION_STRING`, `REDIS_HOST`, and `RAZORPAY_API_KEY` are properly set.
- Run the server:
```bash
npm run dev
```
*(Optionally, you can run the `seed:theaters`, `seed:movies`, and `seed:shows` scripts from `package.json` to populate your local DB).*

### 3. Frontend Setup
```bash
cd client
npm install
```
- Create a `.env` file in the `client` directory and set your backend API URL (e.g., `VITE_API_URL=http://localhost:5000/api`).
- Run the frontend:
```bash
npm run dev
```

---

## 🐳 Docker & AWS Deployment Guide

This section covers the instructions to deploy the backend ecosystem (Node API, MongoDB Replica Set, Redis) to an AWS EC2 instance using Docker Compose, and deploying the frontend to Vercel.

### Step 1: Build and Push the Backend Docker Image
1. Inside the `server` directory, build your Docker image:
   ```bash
   cd server
   docker build -t <your-dockerhub-username>/bookmovies-backend:v1 .
   ```
2. Push the built image to Docker Hub:
   ```bash
   docker push <your-dockerhub-username>/bookmovies-backend:v1
   ```
3. Open `docker-compose.yml` in the root folder and update the `backend` service `image` property to match your newly pushed image.

### Step 2: AWS EC2 Instance Setup
1. Log in to AWS and launch a new **Ubuntu EC2 instance**.
2. Configure the Security Group to allow inbound traffic on:
   - **Port 22** (SSH)
   - **Port 5000** (Backend API traffic)
3. SSH into your EC2 instance:
   ```bash
   ssh -i your-key-pair.pem ubuntu@<your-ec2-public-ip>
   ```
4. Install Docker and Docker Compose on the EC2 instance:
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose -y
   sudo usermod -aG docker $USER
   # Log out and log back in for group changes to take effect
   ```

### Step 3: Deploy Backend on EC2
1. From your local machine, securely copy the necessary deployment files to your EC2 instance:
   ```bash
   # Create a server directory on EC2 to hold the env file
   ssh -i your-key-pair.pem ubuntu@<your-ec2-public-ip> "mkdir -p ~/server"

   # Copy docker-compose.yml to EC2 root
   scp -i your-key-pair.pem docker-compose.yml ubuntu@<your-ec2-public-ip>:~

   # Copy server/.env to EC2 server directory
   scp -i your-key-pair.pem server/.env ubuntu@<your-ec2-public-ip>:~/server/.env
   ```
2. Ensure the copied `.env` file on EC2 has `FRONTEND_URL` updated to your production frontend domain (once deployed).
3. SSH back into your EC2 instance and run Docker Compose:
   ```bash
   docker-compose up -d
   ```
4. Check the logs to verify everything is running smoothly:
   ```bash
   docker-compose logs -f
   ```
   *Your Backend API, Redis container, and MongoDB instance (configured as a Replica Set for transactions) should now be live on `http://<your-ec2-public-ip>:5000`.*

### Step 4: Frontend Deployment (Vercel)
1. Since the project includes a `vercel.json` file in the `client` directory, it is optimized for Vercel.
2. In your `client/.env` (or Vercel Environment Variables dashboard), set your API URL to point to your EC2 backend:
   ```env
   VITE_API_URL=http://<your-ec2-public-ip>:5000/api
   ```
3. Deploy the `client` directory using the Vercel CLI (`vercel`) or by connecting your GitHub repository to Vercel and setting the root directory to `client`.

---

## 📜 License
This project is licensed under the ISC License.

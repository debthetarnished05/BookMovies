import { config as conf } from "dotenv";

conf();

const config = Object.freeze({
  port: process.env.PORT,
  databaseUrl: process.env.MONGO_CONNECTION_STRING,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  hashingSecret: process.env.HASH_SECRET,
  emailUsername: process.env.EMAIL_USERNAME,
  emailPassword: process.env.EMAIL_PASSWORD,
  redisUrl: process.env.REDIS_URL,                          // Upstash / Render
  redisHost: process.env.REDIS_HOST,
  redisPort: parseInt(process.env.REDIS_PORT || "6379", 10),
  razorpayKey: process.env.RAZORPAY_API_KEY,
  razorpaySecret: process.env.RAZORPAY_SECRET_KEY,
  databaseReplicaSet: process.env.MONGO_REPLICA_STRING,
});

export default config;
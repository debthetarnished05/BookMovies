import Redis from "ioredis";
import config from "./config.js";

// Support Upstash (REDIS_URL with TLS) or local Docker (host + port)
const redis = config.redisUrl
  ? new Redis(config.redisUrl, {
      tls: { rejectUnauthorized: false },
      retryStrategy: () => 5000,
    })
  : new Redis({
      host: config.redisHost,
      port: config.redisPort,
      retryStrategy: () => 5000,
    });

redis.on("error", (err) => {
  console.error("[Redis error:]", err);
});

redis.on("connect", () => {
  console.log("[Redis] Connected successfully.");
});

export default redis;
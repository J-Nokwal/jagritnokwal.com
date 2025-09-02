import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedisClient(): Redis {

  if (!redis) {
    redis = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD, // optional
      tls: process.env.REDIS_TLS === "true" ? {} : undefined, // for managed services like Upstash Enterprise or AWS
    });
  }
  return redis;
}
// lib/redis.ts
import { createClient } from "redis";

let client: ReturnType<typeof createClient> | null = null;

export function getRedisClient(): ReturnType<typeof createClient> {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL,
      password: process.env.REDIS_PASSWORD,
    });

    client.on("error", (err) => console.error("Redis Client Error", err));
  }

  if (!client.isOpen) {
    // Lazily connect when needed
    client.connect().catch(console.error);
  }

  return client;
}

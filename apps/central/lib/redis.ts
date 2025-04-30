import { Redis } from "@upstash/redis";
import { env } from "./env";

export const db = new Redis({
  url: env.REDIS_KV_REST_API_URL,
  token: env.REDIS_KV_REST_API_TOKEN,
});
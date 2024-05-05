import { Redis } from "ioredis";
require("dotenv").config();
const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log(`Redis Connected`);
    return process.env.REDIS_URL;
  }
  throw new Error(`Redis connection failed`);
};
//export const redis = new Redis(redisClient());
export const redis = new Redis({
    connectTimeout: 10000, // Set the connection timeout to 10 seconds
    url: redisClient() // Pass the Redis URL
  });


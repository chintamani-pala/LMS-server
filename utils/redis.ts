/*import { Redis } from "ioredis";
require("dotenv").config();
const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log(`Redis Connected`);
    return process.env.REDIS_URL;
  }
  throw new Error(`Redis connection failed`);
};
export const redis = new Redis(redisClient());
*/


import Redis from "ioredis"; // Change the import statement

import dotenv from "dotenv";
dotenv.config();

const redisClient = (): string => {
  if (process.env.REDIS_URL) {
    console.log(`Redis Connected`);
    return process.env.REDIS_URL;
  }
  throw new Error(`REDIS_URL environment variable is not defined`);
};

const redisUrl = new URL(process.env.REDIS_URL || "");
const redisOptions:any= {
  connectTimeout: 10000, // Set the connection timeout to 10 seconds
  host: redisUrl.hostname,
  port: Number(redisUrl.port), // Convert port to number
  password: redisUrl.password
};

export const redis = new Redis(redisOptions);

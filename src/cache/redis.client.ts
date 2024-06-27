/* import session from 'express-session';
import connectRedis from 'connect-redis';
import { createClient } from 'redis';

const RedisStore = connectRedis(session);

const redisClient = createClient({
  password: "q6NgJZMQTFCKj3MoGznvWhrADV3iovf9",
  host: "redis-13243.c92.us-east-1-3.ec2.redns.redis-cloud.com",
  port: 13243,
});

redisClient.on("error", (err) => {
  console.error("Redis client error", err);
});

export const redisStore = new RedisStore({
  client: redisClient,
  prefix: "adultsite:",
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});
 */
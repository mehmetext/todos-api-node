import { createClient, RedisClientType } from "redis";
import env from "./env";

const redisClient: RedisClientType = createClient({
  url: env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      return Math.min(retries * 100, 3000);
    },
  },
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));
redisClient.on("connect", () => console.log("Redis Client Connected"));

redisClient.connect().catch(console.error);

export default redisClient;

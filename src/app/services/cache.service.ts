import redisClient from "@/lib/core/redis";

export default class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  static async set(key: string, value: unknown, ttl?: number): Promise<void> {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttl,
    });
  }

  static async del(key: string): Promise<void> {
    await redisClient.del(key);
  }

  static async delByPattern(pattern: string): Promise<void> {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  }

  static generateKey(prefix: string, ...args: string[]): string {
    return `${prefix}:${args.join(":")}`;
  }
}

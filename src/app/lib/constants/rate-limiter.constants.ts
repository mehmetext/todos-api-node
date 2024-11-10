export const RATE_LIMITER = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 50,
  HEADERS: {
    STANDARD: true,
    LEGACY: false,
  },
} as const;

export const AUTH = {
  COOKIE: {
    NAME: "refresh_token",
    PATH: "/api/auth",
    OPTIONS: {
      httpOnly: true,
      sameSite: "strict",
    },
  },
  TOKEN: {
    DEFAULT_ACCESS_EXPIRY: "15m",
    DEFAULT_REFRESH_EXPIRY: "7d",
  },
} as const;

import env from "../core/env";

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
    DEFAULT_ACCESS_EXPIRY: env.NODE_ENV === "development" ? "30d" : "15m",
    DEFAULT_REFRESH_EXPIRY: "30d",
  },
} as const;

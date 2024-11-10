import jwt from "jsonwebtoken";
import ms from "ms";
import { AUTH } from "../constants";
import env from "../core/env";
import { IAuthTokens, ITokenPayload } from "../types/auth.types";

export const generateTokens = (payload: ITokenPayload): IAuthTokens => {
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: AUTH.TOKEN.DEFAULT_ACCESS_EXPIRY,
  });

  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: AUTH.TOKEN.DEFAULT_REFRESH_EXPIRY,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): ITokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as ITokenPayload;
};

export const verifyRefreshToken = (token: string): ITokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as ITokenPayload;
};

export const getRefreshTokenExpiryMs = (): number => {
  return ms(AUTH.TOKEN.DEFAULT_REFRESH_EXPIRY);
};

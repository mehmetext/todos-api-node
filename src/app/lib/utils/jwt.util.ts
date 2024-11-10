import jwt from "jsonwebtoken";
import { env } from ".";
import { IAuthTokens, ITokenPayload } from "../types/auth.types";

export const generateTokens = (payload: ITokenPayload): IAuthTokens => {
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): ITokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as ITokenPayload;
};

export const verifyRefreshToken = (token: string): ITokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as ITokenPayload;
};

import { Request } from "express";

interface ITokenPayload {
  userId: string;
}

interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface IAuthRequest extends Request {
  user?: IUser;
}

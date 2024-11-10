import { Request } from "express";

interface IUser {
  id: string;
  email: string;
  name: string;
}

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

import prisma from "@/lib/core/prisma";
import {
  generateTokens,
  getRefreshTokenExpiryMs,
  verifyRefreshToken,
} from "@/lib/utils";
import { RegisterInput } from "@/lib/validations";
import bcrypt from "bcrypt";

export default class AuthService {
  static async login(
    email: string,
    password: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    const tokens = generateTokens({ userId: user.id });

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        ipAddress: ipAddress,
        userAgent: userAgent,
        expiresAt: new Date(Date.now() + getRefreshTokenExpiryMs()),
      },
    });

    return tokens;
  }

  static async register(body: RegisterInput["body"]) {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const userExists = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (userExists) {
      return false;
    }

    await prisma.user.create({
      data: { ...body, password: hashedPassword },
    });

    return true;
  }

  static async refresh(
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (
      !tokenRecord ||
      !tokenRecord.isValid ||
      tokenRecord.expiresAt < new Date()
    ) {
      if (tokenRecord) {
        await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
      }
      return null;
    }

    const decoded = verifyRefreshToken(refreshToken);
    const tokens = generateTokens({ userId: decoded.userId });

    await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: decoded.userId,
        expiresAt: new Date(Date.now() + getRefreshTokenExpiryMs()),
        ipAddress,
        userAgent,
      },
    });

    return tokens;
  }
}

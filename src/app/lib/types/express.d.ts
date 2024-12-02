import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {}; // Bu dosyanın bir modül olarak değerlendirilmesi için gerekli

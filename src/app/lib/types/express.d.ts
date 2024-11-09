declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

export {}; // Bu dosyanın bir modül olarak değerlendirilmesi için gerekli

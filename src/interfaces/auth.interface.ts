/* eslint-disable @typescript-eslint/no-namespace */
export interface RegisterAccount {
  email: string;
  username: string;
  password: string;
}

export interface LoginAccount {
  email: string;
  password: string;
}

// Augment the Request type from express
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

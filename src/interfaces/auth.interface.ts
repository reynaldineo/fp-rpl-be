/* eslint-disable @typescript-eslint/no-namespace */
export interface RegisterAccount {
  email: string;
  password: string;
  created_at: Date;
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

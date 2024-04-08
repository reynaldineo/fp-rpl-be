import { Role } from "@prisma/client";

// Sample . Taken from a template
export interface User {
  id?: number;
  email: string;
  password: string;
}

export interface UpdateUser {
  email?: string;
  password?: string;
  role?: Role;
  bio?: string;
}

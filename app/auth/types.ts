export type UserRole = "STUDENT" | "LECTURER" | "ADMIN";

export type AuthUser = {
  userId: string;
  username: string;
  email: string;
  role: UserRole;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  userId: string;
  username: string;
  email: string;
  role: UserRole;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  role: UserRole;
};

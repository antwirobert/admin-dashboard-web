export enum UserRole {
  STAFF = "staff",
  ADMIN = "admin",
}

export type SignUpPayload = {
  email: string;
  name: string;
  password: string;
  role: UserRole;
};

export type User = {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  name: string;
  role: UserRole;
};

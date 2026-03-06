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

export type Order = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
};

export type ListResponse<T = unknown> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type GetOneResponse<T = unknown> = {
  data: T;
};

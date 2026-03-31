export type AuthResponse = {
  accessToken: string;
  tokenType: string;
  user: UserProfile;
};

export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "USER";
  createdAt: string;
  updatedAt: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  createdAt: string;
};

export type ProductQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
};

export type ProductListResponse = {
  items: Product[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export type ProductSummary = {
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
};

export type CreateProductPayload = {
  name: string;
  description?: string;
  price: number;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

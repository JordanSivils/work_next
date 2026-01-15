export interface Product {
  id: string
  description: string;
  available: number;
  status: ProductStatus;
  category: string
}
export type ProductStatus = 'standard' | 'negative';

export type ItemSortField = "description" | "available";
export type ItemSortDir = "asc" | "desc"

export interface ProductQuery {
  page?: string
  limit?: string
  status?: ProductStatus
  brand?: string
  suppliers?: string
  category?: string
  search?: string
  sort?: "description" | "available"
  dir?: "asc" | "desc"
}
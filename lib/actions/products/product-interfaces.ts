
export type ItemSortField = "description" | "available";
export type ItemSortDir = "asc" | "desc"
export type SortOpts = "description" | "available"

export interface Product {
  id: string
  description: string;
  available: number;
  category: string
}


export interface ProductQuery  {
  brand?: string
  supplier?: string
  category?: string
  search?: string
  sort?: SortOpts
  page?: string
  limit?: string
  dir?: "asc" | "desc"
}
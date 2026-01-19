import { BaseListResponse } from "../base-interfaces/base-responses";

export type ProductStatus = 'standard' | 'negative';
export type ItemSortField = "description" | "available";
export type ItemSortDir = "asc" | "desc"
export type SortOpts = "description" | "available"

export interface Product {
  id: string
  description: string;
  available: number;
  status: ProductStatus;
  category: string
}


export interface ProductQuery  {
  status?: ProductStatus
  brand?: string
  supplier?: string
  category?: string
  search?: string
  sort?: SortOpts
  page?: string
  limit?: string
  dir?: "asc" | "desc"
}

export interface ProductResponse extends BaseListResponse {
  data: Product[]
}
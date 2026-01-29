import { Prisma } from "@/app/generated/prisma/browser";
import { BaseListResponse } from "../base-interfaces/base-responses";
import { Brand } from "../brands/brand-interface";
import { Supplier } from "../suppliers/supplier-interfaces";

export type ItemSortField = "description" | "available";
export type ItemSortDir = "asc" | "desc"
export type SortOpts = "description" | "available"

export interface ProductTable {
  id: string
  description: string;
  available: number;
  category: string
}

export interface Product {
  id: string
  sku?: string
  available?: number
  margin?: number
  brandId?: string
  supplierId?: string
  categoryId?: string
  description: string
  Category?: Category
  Brand?: Brand
  Supplier?: Supplier
  createdAt?: Date
  updatedAt?: Date
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

export type ProudctTableRow = Prisma.ProductGetPayload<{
  include: { Category: {
    select: { name: true }
  }}
}>
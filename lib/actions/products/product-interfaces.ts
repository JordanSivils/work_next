import { Prisma } from "@/app/generated/prisma/browser";

import { Supplier } from "../suppliers/supplier-interfaces";
import z from "zod";

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
  Supplier?: Supplier
  createdAt?: Date
  updatedAt?: Date
}

export const productQuerySchema = z.object({
  brandId: z.string().optional(),
  supplierId: z.string().optional(),
  categoryId: z.string().optional(),
  search: z.string().optional(),
  sortDir: z.enum(["asc", "desc"]).optional(),
  sortKey: z.uuid().optional(),
  page: z.coerce.number(),
  limit: z.coerce.number()
})

export type ProductQuery = z.infer<typeof productQuerySchema>

export type ProductTableRow = Prisma.ProductGetPayload<{
  include: { Category: {
    select: { name: true }
  }}
}>
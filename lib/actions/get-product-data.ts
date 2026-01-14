'use server';

import prisma from "../prisma-export/prisma-client";

export interface Product {
  id: string
  description: string;
  available: number;
  status: ProductStatus;
  category: string
}
export type ProductStatus = 'standard' | 'negative';

export interface ProductQuery {
  // page?: string
  take?: string
  // q?: string
}

export async function getItems(q: ProductQuery) {
  return await prisma.item.findMany({
    take: q.take === undefined ? 10 : parseInt(q.take),
    include: {
      Category: {
        select: {
          name: true
        }
      }
    }
  })
}


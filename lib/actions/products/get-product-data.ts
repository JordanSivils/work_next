'use server';

import prisma from "@/lib/prisma-export/prisma-client";
import { ProductQuery } from "./product-interfaces";
import { Prisma } from "@/app/generated/prisma/client";

const whereBuilder = (q: ProductQuery): Prisma.ItemWhereInput => {
  return {
    status: q.status ?? undefined,
    Brand: { name: q.brand },
    Supplier: { some: { name: q.supplier } },
    ...(q.search && {
      OR: [
        { description: {
          contains: q.search, mode: "insensitive"
        }}
      ]
    })
  }
}

function sortBuilder(q: ProductQuery) {
  let orderBy: Prisma.ItemOrderByWithRelationInput = {}
  let dir = q.dir
  switch (q.sort) {
    case "description": orderBy = { description: dir ?? "asc" }
    break;
    case "available": orderBy = { available: dir ?? "asc" }
    break;
    default: orderBy = { description: "asc"}
  }
  return orderBy
}


export async function getAllProducts(q: ProductQuery) {
  const where = whereBuilder(q)
  const orderBy = sortBuilder(q)
  const limit = Number(q.limit ?? 25)
  const page = Number(q.page ?? 1)
  const skip = Number((page - 1) * limit);
  
  const [data, total] = await Promise.all([
    prisma.item.findMany({
      where,
      orderBy: [
        orderBy,
        { description: "asc"}
      ],
      take: limit,
      skip: skip ?? 24,
      include: {
        Category: {
          select: { name: true }
        }
      }
    }),
    prisma.item.count({ where })
  ])
  return {
    page: page,
    limit: limit,
    total,
    pageCount: Math.ceil(total / limit),
    nextPage: page * limit < total,
    previousPage: page > 1,
    data
  }
}
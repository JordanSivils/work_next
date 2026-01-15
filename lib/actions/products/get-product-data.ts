'use server';

import prisma from "@/lib/prisma-export/prisma-client";
import { ProductQuery } from "./product-interfaces";
import { Prisma } from "@/app/generated/prisma/client";

const whereBuilder = (q: ProductQuery): Prisma.ItemWhereInput => {
  return {
    status: q.status,
    Brand: { name: q.brand },
    Supplier: { some: { name: q.suppliers } },
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
    default: orderBy = { description: "desc"}
  }
  return orderBy
}


export async function getAllProducts(q: ProductQuery) {
  const where = whereBuilder(q)
  const orderBy = sortBuilder(q)
  const limit = Number(q.limit ?? 25)
  const page = Number(q.page ?? 1)
  const skip = Number((page - 1) * limit);

  console.log({ 
    where: where,
    orderBy: orderBy,
    limit: limit,
    page: page,
    skip: skip
  })
  
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
        Category: true
      }
    }),
    prisma.item.count({ where })
  ])
  return {
    page: q.page,
    limit: q.limit,
    total,
    pageCount: Math.ceil(total / Number(q.limit)),
    nextPage: Number(q.page) * Number(q.limit) < total,
    previousPage: Number(q.page) > 1,
    data
  }
}


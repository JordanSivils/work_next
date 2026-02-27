'use server';

import prisma from "@/lib/prisma-export/prisma-client";
import {  ProductQuery } from "./product-interfaces";
import { Prisma } from "@/app/generated/prisma/client";
import { reqRoles } from "../require-auth";

const productWhereBuilder = (q: ProductQuery): Prisma.ProductWhereInput => {
  return {
    Brand: { name: q.brand },
    Supplier: { name: q.supplier },
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
  let orderBy: Prisma.ProductOrderByWithRelationInput = {}
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

export async function getAllProducts(q: ProductQuery){
  
  await reqRoles.loggedIn()

  const where = productWhereBuilder(q)
  const orderBy = sortBuilder(q)
  const limit = Number(q.limit ?? 25)
  const page = Number(q.page ?? 1)
  const skip = Number((page - 1) * limit);
  
  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [
        orderBy,
        { description: "asc"}
      ],
      take: limit,
      skip: skip ?? 0,
      include: {
        Category: true
      }
    }),
    prisma.product.count({ where })
  ])
  return {
    ok: true,
    result: {
      page: page,
      limit: limit,
      total,
      pageCount: Math.ceil(total / limit),
      nextPage: page * limit < total,
      previousPage: page > 1,
      data
    }
  }
}
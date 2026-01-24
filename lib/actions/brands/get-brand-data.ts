import prisma from "@/lib/prisma-export/prisma-client";
import { BrandQuery } from "./brand-interface";
import { Prisma } from "@/app/generated/prisma/browser";

type SortDir = "asc" | "desc"

function buildBrandWhere(q?: BrandQuery): Prisma.BrandWhereInput {
    return {
        ...(q?.search && {
        OR: [
            { name: {
                contains: q.search, mode: "insensitive"
            }}
        ]
    })    
    }
} 

function parseDir(dir: unknown): SortDir {
  return dir === "desc" ? "desc" : "asc"
}
function brandSortBuilder(q?: BrandQuery) {
    let orderBy: Prisma.BrandOrderByWithRelationInput = {}
    let dir = parseDir(q?.dir)

    switch (q?.sort) {
        case "name": orderBy = { name: dir ?? "asc"}
        break
        default: orderBy =  { name: "asc"}
    } 
    return orderBy
}

export async function getBrandData(q?: BrandQuery) {
    const where = buildBrandWhere(q)
    const orderBy = brandSortBuilder(q) ;
    const limit = Number(q?.limit ?? 300)
    const page = Number(q?.page ?? 1)
    const skip = Number((page - 1) * limit);
    const [data, total] = await Promise.all([
        prisma.brand.findMany({
            where,
            orderBy,
            take: limit,
            skip: skip ?? 0,
            include: {
                _count: {
                  select: { Product: true}
                }
            }
        }),
        prisma.brand.count()
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

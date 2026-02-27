"use server"
import prisma from "@/lib/prisma-export/prisma-client";
import { BrandQuery } from "./brand-interface";
import { Prisma } from "@/app/generated/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerk } from "../users/get-users";
import { reqRoles } from "../require-auth";

export type SortDir = "asc" | "desc"

function buildBrandWhere(q?: BrandQuery): Prisma.BrandWhereInput {
    return {
        ...(q?.isActive !== undefined ? { isActive: q.isActive } : { isActive: true }),
        ...(q?.inventoriedById  && { inventoriedById: q.inventoriedById}),
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
        case "name": orderBy = { name: dir }
        break
        case "lastInventoriedAt": orderBy = { lastInventoriedAt: dir }
        break
        default: orderBy =  { name: "asc"}
    } 
    return orderBy
}

export async function getBrandData(q?: BrandQuery) {
    await reqRoles.loggedIn()
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
            include: { user: true}
        }),
        prisma.brand.count({ where })
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

export async function getBrandsByCurrentUser() {
    await reqRoles.loggedIn()
    const { userId } = await auth()
    if (!userId) throw new Error("no user logged in")
        
    const user = await getUserByClerk(userId)
    if (!user) throw new Error("No Brands found")

    return await prisma.brand.findMany({
        where: { inventoriedById: user.id },
        orderBy: { lastInventoriedAt: "asc" }
    })
}
"use server"
import { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma-export/prisma-client";
import { SupplierQuery } from "./supplier-interfaces";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerk } from "../users/get-users";
import { reqRoles } from "../require-auth";

const supplierWhereBuilder = (q?: SupplierQuery): Prisma.SupplierWhereInput => {
    return {
        ...(q?.isActive !== undefined ? { isActive: q.isActive} : { isActive: true }),
        ...(q?.orderedById && { userId: q.orderedById }),
        ...(q?.search && {
            OR: [{
                name: { contains: q.search, mode: "insensitive"}
            }]
        })
    }
}

const supplierSortBuilder = (q?: SupplierQuery) => {
    let orderBy: Prisma.SupplierOrderByWithRelationInput = {};
    let dir = q?.dir ?? "desc";

    switch (q?.sort) {
        case "specialOrderCount": orderBy = { SpecialOrder: { _count: dir }}
        break
        case "name": orderBy = { name: dir}
        break
        default: orderBy = { name: "asc" }
    }
    return orderBy
}

export const getSupplierData = async (q?: SupplierQuery) => {
    await reqRoles.loggedIn()
    const where = supplierWhereBuilder(q);
    const orderBy = supplierSortBuilder(q);
    const limit = q?.limit ?? 300;
    const page = q?.page ?? 1;
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
        prisma.supplier.findMany({
            where,
            orderBy,
            take: limit,
            skip: skip ?? 0,
            include: { 
                User: true,
                _count: { select: { SpecialOrder: true }}
            }
        }),
        prisma.supplier.count({ where })
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

export async function getSuppliersByCurrentUser() {
    await reqRoles.loggedIn()
    const { userId } = await auth()
    if (!userId) throw new Error("no user logged in")
    const user = await getUserByClerk(userId)
    if (!user) throw new Error("Couldnt find logged in user")
    
    return await prisma.supplier.findMany({
        where: {
            userId: user.id
        },
        select: {
            id: true,
            name: true,
            _count: { select: { SpecialOrder: true }}
        }
    })
}
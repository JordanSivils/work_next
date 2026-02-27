"use server"
import { Prisma } from "@/app/generated/prisma/client";
import { SpecialOrderQuery } from "./special-order-interfaces";
import { SortDir } from "../brands/get-brand-data";
import { execPath } from "process";
import prisma from "@/lib/prisma-export/prisma-client";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerk } from "../users/get-users";
import { reqRoles } from "../require-auth";

const specialOrderWhere = (q?: SpecialOrderQuery): Prisma.SpecialOrderWhereInput => {
    return {
        ...(q?.supplierId && { supplierId: q.supplierId}),
        ...(q?.userId && { Supplier: { User: { id: q.userId }}})
    }
} 

function parseDir(dir: unknown): SortDir {
    return dir === "desc" ? "desc" : "asc"
}

const specialOrderSort = (q?: SpecialOrderQuery) => {
    let orderBy: Prisma.SpecialOrderOrderByWithRelationInput = {};
    let dir = parseDir(q?.sortDir);

    switch (q?.sortKey) {
        case "createdAt": orderBy = { createdAt: dir}
        break
        case "orderStatus": orderBy = { orderStatus: dir}
        default: orderBy = { createdAt: dir}
    }
    return orderBy
}

export async function getSpecialOrderData(q?: SpecialOrderQuery) {
    await reqRoles.loggedIn()
    const where = specialOrderWhere(q);
    const orderBy = specialOrderSort(q);
    const page = q?.page ?? 1;
    const limit = q?.limit ?? 25;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        prisma.specialOrder.findMany({
            where,
            orderBy,
            take: limit,
            skip: skip,
            include: {
                Supplier: {
                    include: { User: true}
                },
                User: true
            }
        }),
        prisma.specialOrder.count({ where })
    ])
    return {
        page,
        limit,
        total,
        pageCount: Math.ceil(total / limit),
        nextPage: page * limit < total,
        prevPage: page > 1,
        data
    }
}

export async function getLoggedInSpecialOrderData() {
    await reqRoles.loggedIn()
    const { userId } = await auth();
    if (!userId) throw new Error("No user Logged in")
    const loggedUser = await getUserByClerk(userId);
    if (!loggedUser) throw new Error("Couldnt find user")

    const [found, unknown] = await Promise.all([
        prisma.specialOrder.findMany({
            where: {
                Supplier: { userId: loggedUser.id}
            },
            include: {
                    Supplier: {
                        include: { User: true}
                    },
                    User: true
            },
            take: 200
    }),
        prisma.specialOrder.findMany({
            where: {
                supplierId: null
            },
            include: {
                    Supplier: {
                        include: { User: true}
                    },
                    User: true
            },
            take: 200
        })
    ])
    return {
        found,
        unknown
    }
}
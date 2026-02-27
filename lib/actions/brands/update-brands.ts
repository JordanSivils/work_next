'use server'
import prisma from "@/lib/prisma-export/prisma-client";
import { reqRoles } from "../require-auth";

export async function UpdateBrandInventoried(id: string) {
    await reqRoles.loggedIn()
    if (!id) throw new Error("No Id")
    return await prisma.brand.update({
        where: { id },
        data: { lastInventoriedAt: new Date() }
    })
}

export async function updateBrandInventoriedBy(rowId: string, userId: string) {
    await reqRoles.loggedIn()
    if (!rowId || !userId) throw new Error("No Id")
    return await prisma.brand.update({
        where: { id: rowId },
        data: { inventoriedById: userId }
    })
}

export async function updateBrandIsActive(id: string, activity: boolean) {
    await reqRoles.loggedIn()
    if (!id) throw new Error("No Id")
    return await prisma.brand.update({
        where: { id },
        data: { isActive: activity }
    })
}
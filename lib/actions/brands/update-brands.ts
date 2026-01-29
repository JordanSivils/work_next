'use server'
import prisma from "@/lib/prisma-export/prisma-client";

export async function UpdateBrandInventoried(name: string) {
    if (!name) throw new Error("No Id")
    return await prisma.brand.update({
        where: { name },
        data: { lastInventoriedAt: new Date() }
    })
}

export async function updateBrandInventoriedBy(rowId: string, userId: string) {
    if (!rowId || !userId) throw new Error("No Id")
    return await prisma.brand.update({
        where: { id: rowId },
        data: { inventoriedById: userId }
    })
}

export async function updateBrandIsActive(id: string, activity: boolean) {
    if (!id) throw new Error("No Id")
    return await prisma.brand.update({
        where: { id },
        data: { isActive: activity }
    })
}
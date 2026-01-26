'use server'
import prisma from "@/lib/prisma-export/prisma-client";

export async function UpdateBrandInventoried(name: string) {
    if (!name) throw new Error("No Id")
    return await prisma.brand.update({
        where: { name },
        data: { lastInventoriedAt: new Date() }
    })
}
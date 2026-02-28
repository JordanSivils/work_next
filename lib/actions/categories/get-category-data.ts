"use server"

import prisma from "@/lib/prisma-export/prisma-client"

export async function getAllCategories() {
    return await prisma.category.findMany()
}
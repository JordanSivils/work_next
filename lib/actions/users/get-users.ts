import prisma from "@/lib/prisma-export/prisma-client";

export async function getAllUsers() {
    return await prisma.user.findMany();
}
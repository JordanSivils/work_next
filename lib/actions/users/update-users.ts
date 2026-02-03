"use server"
import prisma from "@/lib/prisma-export/prisma-client";
import { UserPatch } from "./user-interface";

export const patchUser = async (id: string, f: UserPatch) => {
    return await prisma.user.update({
        where: { id },
        data: f
    })
}

export async function updateUserIsActive(id: string, activity: boolean) {
    if (!id) throw new Error("No Id")
    return await prisma.user.update({
        where: { id },
        data: { isActive: activity }
    })
}
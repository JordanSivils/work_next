"use server"
import prisma from "@/lib/prisma-export/prisma-client";
import { UserPatch } from "./user-interface";
import { reqRoles } from "../require-auth";

export const patchUser = async (id: string, f: UserPatch) => {
    await reqRoles.loggedIn()
    return await prisma.user.update({
        where: { id },
        data: f
    })
}

export async function updateUserIsActive(id: string, activity: boolean) {
    await reqRoles.loggedIn()
    if (!id) throw new Error("No Id")
    return await prisma.user.update({
        where: { id },
        data: { isActive: activity }
    })
}
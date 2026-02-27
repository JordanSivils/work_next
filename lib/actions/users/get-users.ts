"use server"
import prisma from "@/lib/prisma-export/prisma-client";
import { auth } from "@clerk/nextjs/server";
import { reqRoles } from "../require-auth";

export async function getAllUsers() {
    await reqRoles.loggedIn()
    return await prisma.user.findMany({
        orderBy: { firstName: "asc"}
    });
}

export async function getCurrentUser() {
    await reqRoles.loggedIn()
    const { userId } = await auth()
    if (!userId) throw new Error("no user logged in")
    const clerkId = userId

    return await prisma.user.findUnique({
        where: {clerkId}
    })
}

export async function getUserByClerk(id: string) {
    await reqRoles.loggedIn()
    return await prisma.user.findUnique({
        where: {clerkId: id},
        select: { id: true }
    })
}
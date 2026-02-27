"use server"

import prisma from "@/lib/prisma-export/prisma-client";
import { clerkClient } from "@clerk/nextjs/server";
import { reqRoles } from "../require-auth";


export async function createUsers() {
    await reqRoles.loggedIn()
    try {
    const client = await clerkClient()
    const clerkUsers = await client.users.getUserList()
    const ourUsers = await prisma.user.findMany()
    const ourSet = new Set(ourUsers.map(user => user.clerkId)) 
    console.log(ourSet)
    
    const mappedClerk = clerkUsers.data
    .filter(user => !ourSet.has(user.id))
    .map((user) => ({
        clerkId: user.id,
        firstName: user.firstName,
        lastName: user.lastName
    }))

    for (const u of mappedClerk) {
        await prisma.user.create({
            data: {
                clerkId: u.clerkId,
                firstName: u.firstName ?? "",
                lastName: u.lastName ?? ""
            }
        })
    }

    return { ok: true }
    } catch (error: any) {
        console.error(error.message)
    }
}
"use server"
import prisma from "@/lib/prisma-export/prisma-client";
import { SpecialOrderCreate, SpecialOrderEmail, specialOrderEmailSchema, specialOrderItemsArray } from "./special-order-interfaces";
import { sendSpecialOrderEmail } from "../email/special-order-email";
import { auth } from "@clerk/nextjs/server";
import { reqRoles } from "../require-auth";

const managerOneEmail = process.env.MANAGER_ONE_EMAIL
const managerTwoEmail = process.env.MANAGER_TWO_EMAIL
const managerThreeEmail = process.env.MANAGER_THREE_EMAIL

export async function specialOrderCreate(fd: SpecialOrderCreate) {
    await reqRoles.loggedIn()
    const { userId } = await auth()
    if (!userId) throw new Error("No user signed in")
    try {
        const creatorId = await prisma.user.findUnique({
            where: {
                clerkId: userId
            },
            select: { id: true }
        })
        const createSpecialOrder =  await prisma.specialOrder.create({
            data: {
                ...fd,
                createdById: creatorId?.id
            },
            include: {
                Supplier: {
                    include: { User: true }
                },
                User: true
            }
        })

        const parsedItems = specialOrderItemsArray.safeParse(createSpecialOrder.items)

        const mappedSpecialOrderEmail: SpecialOrderEmail = {
            id: createSpecialOrder.id,
            items: parsedItems.success ? parsedItems.data : [],
            notes: createSpecialOrder.notes ?? undefined,
            supplierName: createSpecialOrder.Supplier?.name,
            customer: createSpecialOrder.customer ?? undefined,
            customerContact: createSpecialOrder.customerContact ?? undefined,
            orderStatus: createSpecialOrder.orderStatus,
            existingItem: createSpecialOrder.existingItem ?? false,
            recurring: createSpecialOrder.recurring,
            createAt: createSpecialOrder.createdAt,
            createdBy: `${createSpecialOrder.User?.firstName ?? ""} ${createSpecialOrder.User?.lastName ?? ""}`,
        }
    
        if (!managerOneEmail || !managerTwoEmail || !managerThreeEmail) throw new Error("env emails missing")

        const employeeEmails = [managerOneEmail, managerTwoEmail, managerThreeEmail]
        const emails = createSpecialOrder.Supplier?.User?.email ? [createSpecialOrder.Supplier?.User?.email] : employeeEmails
        
        await sendSpecialOrderEmail(emails, mappedSpecialOrderEmail)
               
    } catch (error) {
        console.error(error)
        throw error
    }
}
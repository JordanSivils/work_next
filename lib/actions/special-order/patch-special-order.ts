"use server"

import prisma from "@/lib/prisma-export/prisma-client"
import { SpecialOrderPatch } from "./special-order-interfaces"
import { OrderStatus } from "@/app/generated/prisma/enums"
import { reqRoles } from "../require-auth"

export const specialOrderPatch = async (id: string, fd: Partial<SpecialOrderPatch>) => {
    await reqRoles.loggedIn()
    return await prisma.specialOrder.update({
        where: { id },
        data: {...fd}
    })
}

export const specialOrderStatusPatch = async (id: string, status: OrderStatus) => {
    return await prisma.specialOrder.update({
        where: { id },
        data: { orderStatus: status}
    })
}
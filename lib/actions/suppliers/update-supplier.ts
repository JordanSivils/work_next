"use server"
import prisma from "@/lib/prisma-export/prisma-client"
import { SupplierPatch } from "./supplier-interfaces"
import { reqRoles } from "../require-auth"

// export async function updateBrandInventoriedBy(rowId: string, userId: string) {
//     if (!rowId || !userId) throw new Error("No Id")
//     return await prisma.supplier.update({
//         where: { id: rowId },
//         data: { userId: userId }
//     })
// }

export async function updateSupplierIsActive(id: string, activity: boolean) {
    await reqRoles.loggedIn()
    if (!id) throw new Error("No Id")
    return await prisma.supplier.update({
        where: { id },
        data: { isActive: activity }
    })
}


export async function patchSupplier(id: string, f: SupplierPatch) {
    await reqRoles.loggedIn()
    if (!id) throw new Error("No id")
    return await prisma.supplier.update({
        where: { id },
        data: f
    })
}
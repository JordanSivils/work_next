"use server"
import prisma from "@/lib/prisma-export/prisma-client"
import { SupplierPatch } from "./supplier-interfaces"

// export async function updateBrandInventoriedBy(rowId: string, userId: string) {
//     if (!rowId || !userId) throw new Error("No Id")
//     return await prisma.supplier.update({
//         where: { id: rowId },
//         data: { userId: userId }
//     })
// }

export async function updateSupplierIsActive(id: string, activity: boolean) {
    if (!id) throw new Error("No Id")
    return await prisma.supplier.update({
        where: { id },
        data: { isActive: activity }
    })
}


export async function patchSupplier(id: string, f: SupplierPatch) {
    if (!id) throw new Error("No id")
    return await prisma.supplier.update({
        where: { id },
        data: f
    })
}
import prisma from "@/lib/prisma-export/prisma-client";

export async function getSupplierData() {
    return await prisma.supplier.findMany({
        select: {
            name: true,
            id: true
        }
    })
}
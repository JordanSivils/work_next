import prisma from "@/lib/prisma-export/prisma-client";
import { BrandQuery } from "./brand-interface";

export async function getBrandData(q?: BrandQuery) {
    
    return await prisma.brand.findMany({
        take: q?.take ? Number(q.take) : 400,
        select: {
            id: true,
            name: true
        }
    })
}
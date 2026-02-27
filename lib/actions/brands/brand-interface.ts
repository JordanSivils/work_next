import { Prisma } from "@/app/generated/prisma/client"
import z from "zod"

// export interface Brand {
//     id?: string
//     name: string
//     itemCount?: number
//     createdAt?: string
//     updatedAt?: string
//     slug?: string
//     inventoriedBy?: string
//     lastInventoriedAt?: Date
//     isActive?: boolean
// }

export const brandSchema = z.object({
    id: z.string(),
    name: z.string(),
    updatedAt: z.coerce.date().optional(),
    inventoriedBy: z.string().optional(),
    lastInventoriedAt: z.coerce.date().optional(),
    isActive: z.boolean().optional()
})
export type SmallBrand = z.infer<typeof brandSchema>

export interface BrandComboboxInterface {
    id: string
    name: string
}

export interface BrandQuery {
    search?: string
    page?: number
    limit?: number
    isActive?: boolean
    inventoriedById?: string
    dir?: "asc" | "desc"
    sort?: "name" | "lastInventoriedAt"
}

export type BrandTableRow = Prisma.BrandGetPayload<{
    include: { user: true }
}>

import { Prisma } from "@/app/generated/prisma/client"
import z from "zod"

export interface Supplier {
    id: string
    name: string
    slug?: string
    orderDay?: string
    ordernNotes?: string
    orderMinimum?: string
    isActive?: boolean
    createdAt?: string
    updatedAt?: string
    userId?: string
}

const supplierQuerySchema = z.object({
    search: z.string().optional(), // where
    sort: z.enum(["name", "specialOrderCount"]).optional(), // sort
    dir: z.enum(["asc", "desc"]).optional(), // sort
    isActive: z.boolean().optional(), //where
    page: z.number().default(1), // where
    limit: z.number().default(25), // where
    orderedById: z.uuid().optional(), // where
    specialOrderCount: z.number().optional() //sort
})
export type SupplierQuery = z.infer<typeof supplierQuerySchema>;

export type SupplierTableRow = Prisma.SupplierGetPayload<{
    include: { 
        User: true,
        _count: { select: { SpecialOrder: true }}
    }
}>

export const smallSupplierSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    specialorders: z.coerce.number().optional()
})
export type SmallSupplier = z.infer<typeof smallSupplierSchema>

export const supplierPatchSchema = z.object({
    orderDay: z.string().optional(),
    orderNotes: z.string().optional(),
    orderMinimum: z.string().optional(),
    isActive: z.boolean().optional(),
    userId: z.uuid().nullable().optional()
})

export type SupplierPatch = z.infer<typeof supplierPatchSchema>;
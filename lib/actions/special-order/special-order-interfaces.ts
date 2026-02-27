import { Prisma } from "@/app/generated/prisma/client";
import z from "zod";

export const specialOrderItemSchema = z.object({
    name: z.string(),
    quantity: z.string(),
    weight: z.string().optional()
})

export type SpecialOrderItem = z.infer<typeof specialOrderItemSchema>

export const specialOrderItemsArray = z.array(specialOrderItemSchema)

export const specialOrderEmailSchema = z.object({
    id: z.uuid(),
    items: z.array(specialOrderItemSchema).default([]),
    notes: z.string().optional(),
    supplierName: z.string().optional(),
    customer: z.string().optional(),
    customerContact: z.string().optional(),
    orderStatus: z.enum(["requested", "rejected", "ordered", "received", "shorted"]).optional(),
    existingItem: z.boolean(),
    createdBy: z.string(),
    recurring: z.boolean(),
    createAt: z.coerce.date(),
})

export type SpecialOrderEmail = z.infer<typeof specialOrderEmailSchema>

export const specialOrderCreateSchema = z.object({
    items: z.array(specialOrderItemSchema),
    notes: z.string().optional(),
    supplierId: z.uuid().nullable().optional(),
    customer: z.string(),
    customerContact: z.string(),
    comments: z.string().optional(),
    orderStatus: z.enum(["requested", "rejected", "ordered", "received", "shorted"]).optional(),
    requestType: z.enum(["order", "cost"]).optional(),
    recurring: z.boolean(),
    existingItem: z.boolean()
})

export type SpecialOrderCreate = z.infer<typeof specialOrderCreateSchema>

export const specialOrderPatchSchema = specialOrderCreateSchema.optional();
export type SpecialOrderPatch = z.infer<typeof specialOrderPatchSchema>;

export const specialOrderQuerySchema = z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(25),
    sortDir: z.enum(["asc", "desc"]).optional(),
    sortKey: z.enum(["orderStatus", "createdAt"]).default("createdAt").optional(),
    userId: z.uuid().nullable().optional(),
    supplierId: z.uuid().nullable().optional()
})

export type SpecialOrderQuery = z.infer<typeof specialOrderQuerySchema>

export type SpecialOrderTableRow = Prisma.SpecialOrderGetPayload<{
    include: { Supplier: {
        include: { User: true }
        },
        User: true
    }
}>

export type SpecialOrderTableTwo = Omit<SpecialOrderTableRow, "itmes"> & {
    items?: SpecialOrderItem[]
}
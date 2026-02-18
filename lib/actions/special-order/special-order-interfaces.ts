import z from "zod";

const specialOrderItem = z.object({
    name: z.string(),
    quantity: z.string(),
    weight: z.string().optional()
})

export const specialOrderItemsArray = z.array(specialOrderItem)

export const specialOrderEmailSchema = z.object({
    id: z.uuid(),
    items: z.array(specialOrderItem).default([]),
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
    items: z.array(specialOrderItem),
    notes: z.string().optional(),
    supplierId: z.uuid().optional(),
    customer: z.string(),
    customerContact: z.string(),
    comments: z.string().optional(),
    orderStatus: z.enum(["requested", "rejected", "ordered", "received", "shorted"]).optional(),
    requestType: z.enum(["order", "cost"]).optional(),
    recurring: z.boolean(),
    existingItem: z.boolean()
})

export type SpecialOrderCreate = z.infer<typeof specialOrderCreateSchema>
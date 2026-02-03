import z from "zod"

export interface User {
    id: string
    clerkId: string
    firstName?: string
    lastName?: string
    email?: string
    phoneNumber?: string
    isActive?: boolean
    createdAt?: string
    updatedAt?: string
}

export interface UserComboboxInterface {
    id: string
    firstName: string
    lastName: string
}

export const userTableSchema = z.object({
    id: z.uuid(),
    clerkId: z.string(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    phoneNumber: z.string().nullable().optional(),
    isActive: z.boolean().optional()
})

export type UserTableRow = z.infer<typeof userTableSchema>

export const userPatchSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().nullable().optional(),
    phoneNumber: z.string().nullable().optional(),
    isActive: z.boolean().optional()
})

export type UserPatch = z.infer<typeof userPatchSchema>
import { Prisma } from "@/app/generated/prisma/client"

export interface Brand {
    id?: string
    name: string
    itemCount?: number
    createdAt?: string
    updatedAt?: string
    slug?: string
    inventoriedBy?: string
    lastInventoriedAt?: string
    isActive?: boolean
}

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

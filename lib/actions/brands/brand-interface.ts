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
    page?: string
    limit?: string
    user: string
    dir?: "asc" | "desc"
    sort?: "name" | "lastInventoriedBy"
}

export type BrandTableRow = Prisma.BrandGetPayload<{
    include: { user: true }
}>

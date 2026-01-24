export interface Brand {
    id?: string
    name: string
    itemCount?: number
    createdAt?: string
    updatedAt?: string
}

export interface BrandComboboxInterface {
    id: string
    name: string
}

export interface BrandQuery {
    search?: string
    page?: string
    limit?: string
    dir?: "asc" | "desc"
    sort?: "name"
}

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
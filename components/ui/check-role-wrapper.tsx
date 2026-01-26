"use client"
import {  useUser } from "@clerk/nextjs"
import { ReactNode } from "react"

interface RequireRolePropes {
    roles: string[]
    children: ReactNode
}

export function RequireRoleWrapper({ roles, children }: RequireRolePropes) {
    const { user } = useUser()
    const getRoles = (user?.publicMetadata?.role ?? []) as string[]
    const allow = roles.some((r) => getRoles.includes(r))

    if (!allow) return null
    return (
        <>{children}</>
    )
}
"use client"
import { ReactNode } from "react"

interface GeneralWrapperProps {
    children: ReactNode
}

export function GeneralWrapper({ children}: GeneralWrapperProps) {
    return (
        <div className="m-4 p-1">{children}</div>
    )
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"

interface HomeComponentWrapperProps {
    title: string
    descritpion: string
    children: ReactNode
}

export function HomeComponentWrapper({ title, descritpion, children }: HomeComponentWrapperProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your {title}</CardTitle>
                <CardDescription>{descritpion}</CardDescription>
            </CardHeader>
            <CardContent className="max-h-70 overflow-auto">
                {children}
            </CardContent>
        </Card>
    )
}
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

type CardTypes = {
    title: string
    url: string
    description: string
    icon: LucideIcon
}

type CardProp = {
    data: CardTypes
}

export function HomeCard({ data }: CardProp) {

    return (
        <Link href={data.url} className="w-full max-w-40">
            <Card >
                <CardHeader>
                    <CardTitle>{data.title}</CardTitle>
                    <CardDescription>
                        {data.description}
                    </CardDescription>
                    <CardContent className="items-center m-0">
                        <data.icon/>
                    </CardContent>
                </CardHeader>
            </Card>
        </Link>
        
    )
}
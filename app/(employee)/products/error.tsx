"use client"

import { Button } from "@/components/ui/button"

export default function ProductError({
    error,
    reset
}: {
    error: Error & { digest?: string}
    reset: () => void
}) {
    return (
        <div>
            <h2>Something Went Wrong</h2>
            <p>{error.message}</p>
            <Button onClick={() => reset}>Reset</Button>
        </div>
    )
    
}
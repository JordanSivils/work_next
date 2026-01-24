"use client"
import { DebouncedInput } from "@/components/ui/debounced-input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { BaseListPaginationInterface } from "@/lib/actions/base-interfaces/base-pagination";
import { PaginationGroup } from "@/components/ui/pagination-group";

interface BrandFilterPaginationProps {
    pagination: BaseListPaginationInterface
}

export function BrandFilterPagination({ pagination }: BrandFilterPaginationProps) {

    const router = useRouter();
        const pathname = usePathname();
        const [isPending, startTransition] = useTransition()
        const searchParams = useSearchParams()

    const handleInputChange = (val: string) => {
        const params = new URLSearchParams(searchParams.toString())
        
        if (!val) {
            params.delete("search")
        } else {
            params.set("page", "1")
            params.set("search", val)
        }
        return startTransition(() => router.push(pathname + '?' + params.toString()))
    }
    
    return (
        <div className="flex justify-between px-4 items-center">
            {isPending ? 
            <>
                <div className="flex-1 flex justify-center">
                <div className="h-9 w-full max-w-100 rounded-md bg-muted animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-muted animate-pulse" />
                <div className="h-8 w-8 rounded-md bg-muted animate-pulse" />

                <div className="flex items-center gap-1 px-2">
                <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                <span className="text-muted-foreground">/</span>
                <div className="h-4 w-6 rounded bg-muted animate-pulse" />
                </div>

                <div className="h-8 w-8 rounded-md bg-muted animate-pulse" />
                <div className="h-8 w-8 rounded-md bg-muted animate-pulse" />
            </div>
            </>
            :
            <>
            <DebouncedInput sendChange={handleInputChange} placeholder="search..." />
            <PaginationGroup pagination={ pagination } />
            </>
            }
            
        </div>
    )
    
}
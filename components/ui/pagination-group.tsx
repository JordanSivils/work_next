"use client"

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "./button";
import { BaseListPaginationInterface } from "@/lib/actions/base-interfaces/base-pagination";
// import { useRouter } from "next/router";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Skeleton } from "./skeleton";

interface PaginationGroupProps {
    pagination: BaseListPaginationInterface
}

function PaginationLoadingState() {
    return (
        <div className="flex items-center gap-1">
      <Skeleton className="h-6 w-6 rounded-md" />
      <Skeleton className="h-6 w-6 rounded-md" />

      <Skeleton className="h-2 w-3" />
      <Skeleton className="h-2 w-1" />
      <Skeleton className="h-2 w-3" />

      <Skeleton className="h-6 w-6 rounded-md" />
      <Skeleton className="h-6 w-6 rounded-md" />
    </div>
    )
}

export function PaginationGroup({ pagination }: PaginationGroupProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition()

    const createQueryString = useCallback((name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(name, value)

        return params.toString();
    }, [searchParams])

    return (
        <div className="flex items-center">
            {isPending ? <PaginationLoadingState /> :
            <>
            <Button 
            className="cursor-pointer" 
            variant={`ghost`} 
            size={`icon-sm`}
            disabled={!pagination.previousPage}
            onClick={() => startTransition(() => router.push(pathname + '?' + createQueryString('page', "1")))}
            >
                <ChevronsLeft className={pagination.previousPage ? "" : "text-muted"} />
            </Button>
            <Button 
            className="cursor-pointer" 
            variant={`ghost`} 
            size={`icon-sm`}
            disabled={!pagination.previousPage}
            onClick={() => startTransition(() => router.push(pathname + '?' + createQueryString('page', String(pagination.currentPage - 1))) )}
            >
                <ChevronLeft className={pagination.previousPage ? "" : "text-muted"} />
            </Button>
            <p>{pagination.currentPage ?? 1}</p>
            <p>/</p>
            <p>{pagination.totalPages}</p>
            <Button 
            className="cursor-pointer" 
            variant={`ghost`} 
            size={`icon-sm`}
            disabled={!pagination.nextPage}
            onClick={() => startTransition(() => router.push(pathname + '?' + createQueryString('page', String(pagination.currentPage + 1)))) }
            >
                <ChevronRight className={pagination.nextPage ? "" : "text-muted"} />
                </Button>
            <Button 
            className="cursor-pointer" 
            variant={`ghost`} 
            size={`icon-sm`}
            disabled={!pagination.nextPage}
            onClick={() => startTransition(() => router.push(pathname + '?' + createQueryString('page', String(pagination.totalPages)))) }
            >
                <ChevronsRight className={pagination.nextPage ? "" : "text-muted"} />
            </Button>
            </>
            }
        </div>
    )
}
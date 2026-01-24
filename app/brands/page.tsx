import { Suspense } from "react";
import { BrandTableWrapper } from "./fetch-page";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export default async function BrandPage({ 
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string |  undefined }>
}) {

    const params = await searchParams;
    const { page, limit, search } = await searchParams

    const sort = params.sort === "name"  ? params.sort : undefined
    const dir = params.dir === "asc" || params.dir === "desc" ? params.dir : undefined

    return (
        <div>
            <h1 className="p-2">Brands</h1>
            <Suspense fallback={<TableSkeleton />}>
                <BrandTableWrapper brandQuery={{ page, limit, sort, dir, search}} />
            </Suspense>
        </div>
        
        
    )
}
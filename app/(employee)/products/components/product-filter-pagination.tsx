"use client"
import { BrandCombobox } from "@/components/ui/brand-combobox";
import { Checkbox } from "@/components/ui/checkbox";
import { DebouncedInput } from "@/components/ui/debounced-input";
import { PaginationGroup } from "@/components/ui/pagination-group";
import { SheetWrapper } from "@/components/ui/sheet-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { SupplierCombobox } from "@/components/ui/supplier-combobox";
import { UserCombobox } from "@/components/ui/user-combobox";
import { BaseListPaginationInterface } from "@/lib/actions/base-interfaces/base-pagination";
import { BrandComboboxInterface } from "@/lib/actions/brands/brand-interface";
import { Supplier } from "@/lib/actions/suppliers/supplier-interfaces";
import { UserComboboxInterface } from "@/lib/actions/users/user-interface";
import { CheckedState } from "@radix-ui/react-checkbox";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

interface FilterPaginationWrapperProps {
    pagination: BaseListPaginationInterface
    brands: BrandComboboxInterface[]
    users: UserComboboxInterface[]
    suppliers: Supplier[]
}

export function FilterPaginationWrapper({ pagination, brands, suppliers, users }: FilterPaginationWrapperProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition()
    const searchParams = useSearchParams()


    const handleQueryFromChild = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(key, value)
        params.set("page", "1")
        return startTransition(() => router.push(pathname + '?' + params))
    }, [searchParams, pathname, router, startTransition])

    const handleClearFromChild = useCallback((key: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete(key)
        params.set("page", "1")
        return startTransition(() => router.push(pathname + '?' + params.toString()))
    }, [searchParams, pathname, router, startTransition])

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

    const [checked, setChecked] = useState(false)

    const handleCheckChange = (next: CheckedState) => {
        const isChecked = next === true
        setChecked(isChecked)
        
        const params = new URLSearchParams(searchParams.toString())
        
        if (!isChecked) {
            params.set("page", "1")
            params.delete("status")
        } else {
            params.set("page", "1")
            params.set("status", "negative")
        }
        startTransition(() => router.push(pathname + '?' + params.toString()))
    }

    return (
        <div className="flex justify-between px-4 items-center">
            <SheetWrapper>
                {isPending ? 
                <>
                    <div>
                    <Skeleton className="h-3 w-24 mb-2" />
                    <Skeleton className="h-10 w-56" />
                    </div>
                    <div>
                    <Skeleton className="h-3 w-24 mb-2" />
                    <Skeleton className="h-10 w-56" />
                    </div>
                    <div>
                        <Skeleton className="h-3 w-24 mb-2" />
                    <Skeleton className="h-10 w-56" />
                    </div>
                </> :
                <>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground pb-2">Select Brand</p>
                        <BrandCombobox isLoading={isPending} productData={handleQueryFromChild} brands={brands} handleClear={() => handleClearFromChild("brand")}/>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground pb-2">Select Brand</p>
                        <SupplierCombobox productData={handleQueryFromChild} suppliers={suppliers} handleClear={() => handleClearFromChild("supplier")} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground pb-2">Select User</p>
                        <UserCombobox isLoading={isPending} sendDataUp={handleQueryFromChild} users={users} handleClear={() => handleClearFromChild("user")} />
                    </div>
                </>
                }
                
            </SheetWrapper>
            <DebouncedInput sendChange={handleInputChange} placeholder="search..." />
            <div>
                <label className="px-2" htmlFor="inventory">Negative</label> 
                <Checkbox id="inventory" checked={checked} onCheckedChange={handleCheckChange} />
            </div>
            

            <PaginationGroup pagination={ pagination } />
        </div>
    )
}
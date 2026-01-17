import { BrandCombobox } from "@/components/ui/brand-combobox";
import { Input } from "@/components/ui/input";
import { PaginationGroup } from "@/components/ui/pagination-group";
import { SheetWrapper } from "@/components/ui/sheet-wrapper";
import { BaseListPaginationInterface } from "@/lib/actions/base-interfaces/base-pagination";
import { Brand } from "@/lib/actions/brands/brand-interface";
import { getBrandData } from "@/lib/actions/brands/get-brand-data";

interface FilterPaginationWrapperProps {
    pagination: BaseListPaginationInterface
    brands: Brand[]
}

export async function FilterPaginationWrapper({ pagination, brands }: FilterPaginationWrapperProps) {
    
    return (
        <div className="flex justify-between px-4">
            <SheetWrapper>
                <div>
                    <p className="text-xs font-semibold text-muted-foreground pb-2">Select Brand</p>
                    <BrandCombobox brands={brands} />
                </div>
            </SheetWrapper>
            <Input type="text" placeholder="search" className="max-w-80" />
            <PaginationGroup pagination={ pagination } />
        </div>
    )
}
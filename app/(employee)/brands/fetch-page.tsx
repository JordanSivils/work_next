import { Brand, BrandQuery } from "@/lib/actions/brands/brand-interface";
import { getBrandData } from "@/lib/actions/brands/get-brand-data";
import { BrandDataTable } from "./components/brand-data-table";
import { columns } from "./components/brand-table-cols";
import { BrandFilterPagination } from "./components/brand-filter-pagination";

interface BrandTableWrapperProps {
    brandQuery?: BrandQuery
}

export async function BrandTableWrapper({ brandQuery }: BrandTableWrapperProps) {
//     const asyncTimeout = () => {
//     return new Promise((resolve) => {
//       setTimeout(resolve, 4000)
//     })
//   }
//   await asyncTimeout();
    const brands = await getBrandData(brandQuery);

    const mappedBrands = brands.data.map((brand): Brand => ({
        id: brand.id,
        name: brand.name,
        itemCount: brand._count.Product
    }))

    const nextPage = brands.nextPage
    const previousPage = brands.previousPage
    const totalPages = brands.pageCount
    const currentPage = brands.page

    return ( 
    <div className="flex flex-col gap-2">
        <BrandFilterPagination pagination={{ nextPage, previousPage, totalPages, currentPage }} />
        <BrandDataTable columns={columns} data={mappedBrands} />
    </div>
        
    )
}
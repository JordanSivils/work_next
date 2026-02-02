import { getBrandData } from "@/lib/actions/brands/get-brand-data";
import { BrandTableContext } from "./components/brand-table-context";
import { BrandTable } from "./components/brand-data-table";
import { BrandTableTopper } from "./components/brand-filter-pagination";
import { getAllUsers } from "@/lib/actions/users/get-users";

export async function BrandTableWrapper() {
    const brands = await getBrandData({limit: 25});
    const users = await getAllUsers();

    return (
        <BrandTableContext brands={brands.data} brandCount={brands.total}>
            <div className="flex flex-col gap-0 m-y-4">
                <div className="sticky top-0 z-30 bg-background p-4">
                    <BrandTableTopper users={users}/>
                </div>
                <div className="px-4">
                    <BrandTable users={users}/>
                </div>
                
            </div>
        </BrandTableContext>
    )
}
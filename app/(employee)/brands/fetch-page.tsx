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
            <div className="flex flex-col gap-4 m-4">
                <BrandTableTopper users={users}/>
                <BrandTable users={users}/>
            </div>
        </BrandTableContext>
    )
}
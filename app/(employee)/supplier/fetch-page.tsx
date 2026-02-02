import { SupplierTableContext } from "./components/supplier-table-context";
import { SupplierDataTable } from "./components/supplier-data-table";
import { getSupplierData } from "@/lib/actions/suppliers/get-supplier-data";
import { getAllUsers } from "@/lib/actions/users/get-users";
import { SupplierTableTopper } from "./components/supplier-filter-pagination";

export async function SupplierTableWrapper() {
    const suppliers = await getSupplierData();
    const users = await getAllUsers();

    return (
        <SupplierTableContext suppliers={suppliers.data} supplierCount={suppliers.total}>
            <div className="flex flex-col gap-0 m-y-4">
                <div className="sticky top-0 z-30 bg-background p-4">
                    <SupplierTableTopper users={users}/>
                </div>
                <div className="px-4">
                    <SupplierDataTable />
                </div>
            </div>
        </SupplierTableContext>
    )
}
import { getSpecialOrderData } from "@/lib/actions/special-order/get-special-order";
import { SpecialOrderTableContext } from "./components/special-order-context";
import { SpecialOrderTable } from "./components/special-order-table";
import { getSupplierData } from "@/lib/actions/suppliers/get-supplier-data";
import { SpecialOrderTableTopper } from "./components/special-order-pagination";
import { Supplier } from "@/lib/actions/suppliers/supplier-interfaces";
import { getAllUsers } from "@/lib/actions/users/get-users";

export async function SpecialOrderTableWrapper() {
    const specialOrders = await getSpecialOrderData({ limit: 25, page: 1});
    const suppliers = await getSupplierData()
    const users = await getAllUsers()

    const mappedSuppliers = suppliers.data.map((supplier): Supplier => ({
        id: supplier.id,
        name: supplier.name
    }))
    
    return (
        <SpecialOrderTableContext specialOrders={specialOrders.data} specialOrderCount={specialOrders.total}>
            <div className="flex flex-col gap-0 m-y-4">
                <div className="sticky top-0 z-30 bg-background p-4">
                    <SpecialOrderTableTopper users={users} suppliers={mappedSuppliers}/>
                </div>
                <div className="px-4">
                    <SpecialOrderTable />
                </div>
            </div>
        </SpecialOrderTableContext>
    )
}
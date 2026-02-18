import { getSupplierData } from "@/lib/actions/suppliers/get-supplier-data";
import { SpecialOrderForm } from "./special-order-form";
import { Supplier } from "@/lib/actions/suppliers/supplier-interfaces";

export async function SpecialOrderWrapper() {
    const suppliers = await getSupplierData({ page: 1, limit: 500 })

    const mappedSupplier = suppliers.data.map((sup): Supplier => ({
            id: sup.id,
            name: sup.name,
        }))
    return (
        <SpecialOrderForm suppliers={mappedSupplier} />
    )
}
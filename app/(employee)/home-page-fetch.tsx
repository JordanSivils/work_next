import { getBrandData, getBrandsByCurrentUser } from "@/lib/actions/brands/get-brand-data"
import { getCurrentUser } from "@/lib/actions/users/get-users"
import { BrandComboboxInterface, SmallBrand } from "@/lib/actions/brands/brand-interface"
import { SmallBrandTable } from "./components/home/small-brand-table"
import { Suspense } from "react"
import { HomeComponentWrapper } from "./components/home/home-comp-wrapper"
import { getSupplierData, getSuppliersByCurrentUser } from "@/lib/actions/suppliers/get-supplier-data"
import { SmallSupplierTable } from "./components/home/small-supplier-table"
import { SmallSupplier, Supplier } from "@/lib/actions/suppliers/supplier-interfaces"
import { getLoggedInSpecialOrderData, getSpecialOrderData } from "@/lib/actions/special-order/get-special-order"
import { SmallSpecialTable, UnknownSpecialOrder } from "./components/home/small-special-table"
import { SpecialOrderForm } from "./components/forms/special-order-form"
import { InventoryForm } from "./components/forms/inventory-form"
import { RequireRoleWrapper } from "@/components/ui/check-role-wrapper"

export async function HomePageFetch() {
    const user = await getCurrentUser()
    // const asyncTimeout = () => {
    //     return new Promise((resolve) => {
    //     setTimeout(resolve, 3000)
    //     })
    // }
    // await asyncTimeout();
    const currentUsersBrands = await getBrandsByCurrentUser()
    const currentUsersSuppliers = await getSuppliersByCurrentUser()
    const specialOrders = await getLoggedInSpecialOrderData();
    const suppliers = await getSupplierData({ page: 1, limit: 500 })
    const brands = await getBrandData();
    
    
    const comboboxBrands = brands.data.map((brand): BrandComboboxInterface => ({
        id: brand.id,
        name: brand.name
    }))

    const mappedBrands = currentUsersBrands.map((brand): SmallBrand  => ({
        id: brand.id,
        name: brand.name,
        updatedAt: brand.updatedAt,
        inventoriedBy: brand.inventoriedById ?? "",
        lastInventoriedAt: brand.lastInventoriedAt ?? undefined,
        isActive: brand.isActive
    }))
    const mappedSuppliers = currentUsersSuppliers.map((supplier): SmallSupplier  => ({
        id: supplier.id,
        name: supplier.name,
        specialorders: supplier._count.SpecialOrder
    }))
    return (
        <div className="flex flex-col gap-4">
            <div>Hello, {user?.firstName} {user?.lastName}</div>
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                <div className="shrink-0">
                    <InventoryForm sidebar={false} brands={comboboxBrands} />
                </div>
                <div className="lg:flex-1 lg:min-w-0">
                    <HomeComponentWrapper 
                    title="Brands"
                    descritpion="Brands that you are in charge of Inventorying."
                    >
                        <SmallBrandTable brands={mappedBrands}/>
                    </HomeComponentWrapper>
                </div>
            </div>
            
            <RequireRoleWrapper roles={["admin", "manager", "dev"]}>
                <HomeComponentWrapper 
                title="Special Order With Unkown Supplier"
                descritpion="It is on all managers to source the product, determine if we can get it, then notify the correct person to order or get cost."
                >
                    <UnknownSpecialOrder  unknownSpecOrds={specialOrders.unknown}/>
            </HomeComponentWrapper>
            </RequireRoleWrapper>
            
            <HomeComponentWrapper 
            title="Special Orders"
            descritpion="Special Orders for your suppliers."
            >
                <SmallSpecialTable  foundSpecOrds={specialOrders.found}/>
            </HomeComponentWrapper>
            
            <HomeComponentWrapper 
            title="Suppliers"
            descritpion="Suppliers you are in charge of ordering from."
            >
                <SmallSupplierTable suppliers={mappedSuppliers}/>
            </HomeComponentWrapper>
        </div>
    )
}
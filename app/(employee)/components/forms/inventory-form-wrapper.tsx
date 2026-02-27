import { BrandComboboxInterface } from "@/lib/actions/brands/brand-interface";
import { getBrandData } from "@/lib/actions/brands/get-brand-data";
import { InventoryForm } from "./inventory-form";
import { SidebarDialogWrapper } from "./dialog-wrapper-home";
import { FileText } from "lucide-react";

export async function InventoryFormWrapper() {
    const brands = await getBrandData();
    
    const mappedBrands = brands.data.map((brand): BrandComboboxInterface => ({
        id: brand.id,
        name: brand.name
    }))

    return (
        <SidebarDialogWrapper 
        btnLabel={
        <>
        <FileText /> Inventory
        </>
        }
        dialogTitle="Get Inventory PDF"
        dialogDescription="Upload Excel"
        >
            <InventoryForm sidebar={true} brands={mappedBrands}/>
        </SidebarDialogWrapper>
    )
}
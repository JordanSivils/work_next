import { BrandComboboxInterface } from "@/lib/actions/brands/brand-interface";
import { getBrandData } from "@/lib/actions/brands/get-brand-data";
import { InventoryForm } from "./inventory-form";

export async function InventoryFormWrapper() {
    const brands = await getBrandData();

    const mappedBrands = brands.data.map((brand): BrandComboboxInterface => ({
        id: brand.id,
        name: brand.name
    }))

    return <InventoryForm brands={mappedBrands} />
}
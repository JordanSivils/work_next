"use client"
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/lib/debounce";
import { SheetWrapper } from "@/components/ui/sheet-wrapper";
import { Label } from "@/components/ui/label";
import { useProductContext } from "./product-table-context";
import { Supplier } from "@/lib/actions/suppliers/supplier-interfaces";
import { BrandComboboxInterface } from "@/lib/actions/brands/brand-interface";
import { CategoryCombobox } from "@/components/ui/category-combobox";
import { SupplierCombobox } from "@/components/ui/supplier-combobox";
import { BrandCombobox } from "@/components/ui/brand-combobox";

interface ProductTableTopProps {
    suppliers: Supplier[]
    categories: Category[]
    brands: BrandComboboxInterface[]
}

export function ProductTableTopper({ categories, suppliers, brands }: ProductTableTopProps) {
    const { page, setBrandId, setSupplierId, setCategoryId, totalPages, setPage, refresh, nextPage, search, setSearch, prevPage, loading } = useProductContext()
    
    const [thisSearch, setThisSearch] = useState<string>("")
    const debouncedSearch = useDebounce(thisSearch, 300);

    const handleBrandId = (id: string) => {
        setBrandId(id);
        refresh();
    }
    const handleBrandClear = () => {
        setBrandId(undefined)
        setPage(1)
    }

    const handleSupplierId = (id: string) => {
        setSupplierId(id);
        refresh();
    }
    const handleSupplierClear = () => {
        setSupplierId(undefined)
        setPage(1)
    }

    const handleCategoryId = (id: string) => {
        setCategoryId(id);
        refresh();
    }
    const handleCategoryClear = () => {
        setCategoryId(undefined)
        setPage(1)
    }
    
    useEffect(() => {
        const s = debouncedSearch.trim()
        setSearch(s ? s : undefined)
    }, [debouncedSearch, setSearch])
    
    return (
        <div className="flex justify-between items-center gap-4">
            <SheetWrapper>
                <div className="flex flex-col gap-2">
                    <Label>Select Category</Label>
                    <CategoryCombobox sendDataUp={handleCategoryId} handleClear={handleCategoryClear} categories={categories}/>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Select Supplier</Label>
                    <SupplierCombobox sendDataUp={handleSupplierId} handleClear={handleSupplierClear} suppliers={suppliers}/>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Select Brand</Label>
                    <BrandCombobox isLoading={loading} sendDataUp={handleBrandId} handleClear={handleBrandClear} brands={brands}/>
                </div>
            </SheetWrapper>
            <Input type="text" value={thisSearch} onChange={(e) => setThisSearch(e.target.value)} className="max-w-100" />
            <div className="flex items-center">
                <Button 
                className="cursor-pointer" 
                variant={`ghost`} 
                size={`icon-sm`}
                disabled={loading}
                onClick={() => setPage(1)}
                >
                    <ChevronsLeft className={!loading ? "" : "text-muted"}/>
                </Button>
                <Button 
                className="cursor-pointer" 
                variant={`ghost`} 
                size={`icon-sm`}
                disabled={loading}
                onClick={prevPage}
                >
                    <ChevronLeft className={!loading ? "" : "text-muted"} />
                </Button>
                <p>{page}</p>
                <p>/</p>
                <p>{totalPages}</p>
                <Button 
                className="cursor-pointer" 
                variant={`ghost`} 
                size={`icon-sm`}
                disabled={loading || page === totalPages}
                onClick={nextPage}
                >
                    <ChevronRight className={!loading ? "" : "text-muted"} />
                    </Button>
                <Button 
                className="cursor-pointer" 
                variant={`ghost`} 
                size={`icon-sm`}
                disabled={loading || page === totalPages}
                onClick={() => page < totalPages ? setPage(totalPages) : null }
                >
                    <ChevronsRight className={!loading ? "" : "text-muted"} />
                </Button>
            </div>
        </div>
    )
}
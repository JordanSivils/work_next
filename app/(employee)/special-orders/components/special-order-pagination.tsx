"use client"
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState } from "react";
import { SheetWrapper } from "@/components/ui/sheet-wrapper";
import { Label } from "@/components/ui/label";
import { UserCombobox } from "@/components/ui/user-combobox";
import { UserComboboxInterface } from "@/lib/actions/users/user-interface";
import { useSpecialOrderContext } from "./special-order-context";
import { SupplierCombobox } from "@/components/ui/supplier-combobox";
import { Supplier } from "@/lib/actions/suppliers/supplier-interfaces";

interface BrandTableTopperProps {
    users: UserComboboxInterface[]
    suppliers: Supplier[]
}

export function SpecialOrderTableTopper({ users, suppliers }: BrandTableTopperProps) {
    const { refresh, setUserId, setSupplierId, loading, setPage, prevPage, page, totalPages, nextPage } = useSpecialOrderContext()
    // const [checked, setChecked] = useState(false)

    const handleUserSelect = (id: string) => {
        setUserId(id);
        refresh();
    }

    const handleSupplierSelect = (id: string) => {
        setSupplierId(id);
        refresh();
    }

    const handleUserClear = () => {
        setUserId(undefined)
    }

    const handleSupplierClear = () => {
        setSupplierId(undefined)
    }

    // const handleCheckChange = (next: CheckedState) => {
    //     const isChecked = next === true;
    //     setChecked(isChecked);
    //     setIsActive(isChecked ? false : undefined);
    //     refresh()
    // };
    return (
        <div className="flex justify-between items-center gap-4">
            <SheetWrapper>
                <div>
                    <Label htmlFor="user-combobox">Select User</Label>
                    <UserCombobox isLoading={loading} users={users} handleClear={handleUserClear} formData={handleUserSelect} />
                </div>
                <div>
                    <Label htmlFor="user-combobox">Select Supplier</Label>
                    <SupplierCombobox loading={loading} suppliers={suppliers} handleClear={handleSupplierClear} sendDataUp={handleSupplierSelect} />
                </div>
                {/* <div className="flex gap-2">
                    <Checkbox id="check" checked={checked} onCheckedChange={handleCheckChange}/>
                    <Label htmlFor="check">Show Fullfilled</Label>
                </div> */}
            </SheetWrapper>
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
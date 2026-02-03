"use client"
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/lib/debounce";
import { SheetWrapper } from "@/components/ui/sheet-wrapper";
import { Label } from "@/components/ui/label";
import { UserCombobox } from "@/components/ui/user-combobox";
import { User, UserComboboxInterface } from "@/lib/actions/users/user-interface";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useSupplierTableContext } from "./supplier-table-context";

interface BrandTableTopperProps {
    users: UserComboboxInterface[]
}

export function SupplierTableTopper({ users }: BrandTableTopperProps) {
    const { page, totalPages, setPage, refresh, nextPage, isActive, setIsActive ,search, setSearch, prevPage, loading, setOrderedById } = useSupplierTableContext()
    const [checked, setChecked] = useState(false)
    const [thisSearch, setThisSearch] = useState<string>("")
    const debouncedSearch = useDebounce(thisSearch, 300);

    const handleInventory = (id: string) => {
        setOrderedById(id);
        refresh();
    }
    const handleClear = () => {
        setOrderedById(undefined)
    }

    const handleCheckChange = (next: CheckedState) => {
        const isChecked = next === true;
        setChecked(isChecked);
        setIsActive(isChecked ? false : undefined);
        refresh()
    };


    useEffect(() => {
        const s = debouncedSearch.trim()
        setSearch(s ? s : undefined)
    }, [debouncedSearch, setSearch])
    return (
        <div className="flex justify-between items-center gap-4">
            <SheetWrapper>
                <div>
                    <Label htmlFor="user-combobox">Select User</Label>
                    <UserCombobox isLoading={loading} users={users} handleClear={handleClear} formData={handleInventory} />
                </div>
                <div className="flex gap-2">
                    <Checkbox id="check" checked={checked} onCheckedChange={handleCheckChange}/>
                    <Label htmlFor="check">Show Inactives</Label>
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
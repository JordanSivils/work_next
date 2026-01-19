"use client"

import { useCallback, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Brand } from "@/lib/actions/brands/brand-interface";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./command";
import { CommandList } from "cmdk";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Supplier } from "@/lib/actions/suppliers/supplier-interfaces";

interface SupplierComboboxProps {
    suppliers: Supplier[]
    sendDataUp: (key: string, val: string) => void
    handleClear: () => void
}


export function SupplierCombobox({ suppliers, sendDataUp, handleClear }: SupplierComboboxProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | undefined>(undefined)

    const searchParams = useSearchParams();

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button role="combobox" className="min-w-80">
                    {value
                    ? suppliers.find((supplier) => supplier.name === value)?.name
                    : "Select Supplier"}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent >
                <Command>
                    <CommandInput placeholder="Search Suppliers" />
                    <CommandList className="max-h-70 overflow-y-auto">
                        <CommandEmpty>No Suppliers Found...</CommandEmpty>
                        <CommandGroup >
                            {suppliers.map((supplier) => (
                                <CommandItem 
                                key={supplier.id}
                                value={supplier.name}
                                onSelect={(currentValue) => {
                                    setValue(currentValue ?? "")
                                    setOpen(false)
                                    sendDataUp("supplier", currentValue)
                                }}
                                >
                                    {supplier.name}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === supplier.name ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
            <Button variant={"ghost"} onClick={() => {
                handleClear()
                setValue(undefined)
            }}>Clear</Button>
        </Popover>
    )
}
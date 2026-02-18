"use client"

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./command";
import { CommandList } from "cmdk";
import { cn } from "@/lib/utils";
import { Supplier } from "@/lib/actions/suppliers/supplier-interfaces";

interface SupplierComboboxProps {
    suppliers: Supplier[]
    sendDataUp: (val: string) => void
    handleClear: () => void
}


export function SupplierCombobox({ suppliers, sendDataUp, handleClear }: SupplierComboboxProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | undefined>(undefined)

    return (
        <div className="flex gap-1">
        <Popover open={open} modal onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button role="combobox" className="md:min-w-70 min-w-50">
                    {value
                    ? suppliers.find((supplier) => supplier.id === value)?.name
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
                                onSelect={() => {
                                    setValue(supplier.id)
                                    setOpen(false)
                                    sendDataUp(supplier.id)
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
            <Button variant={"ghost"} type="button" onClick={() => {
                handleClear()
                setValue(undefined)
            }}>Clear</Button>
            
        </Popover>
        </div>
    )
}
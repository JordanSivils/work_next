"use client"

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./command";
import { CommandList } from "cmdk";
import { cn } from "@/lib/utils";

interface SupplierComboboxProps {
    categories: Category[]
    sendDataUp?: (val: string) => void
    handleClear: () => void
    productData?: (key: string, val: string ) => void
    loading?: boolean
    initValue?: string
}


export function CategoryCombobox({ categories, sendDataUp, handleClear, initValue, productData }: SupplierComboboxProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | undefined>(initValue ?? undefined)

    return (
        <div className="flex gap-1">
        <Popover open={open} modal onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button role="combobox" className="md:min-w-70 min-w-50">
                    {value
                    ? categories.find((category) => category.id === value)?.name
                    : "Select Category"}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            
            <PopoverContent >
                <Command>
                    <CommandInput placeholder="Search Suppliers" />
                    <CommandList className="max-h-70 overflow-y-auto">
                        <CommandEmpty>No Suppliers Found...</CommandEmpty>
                        <CommandGroup >
                            {categories.map((category) => (
                                <CommandItem 
                                key={category.id}
                                value={category.name}
                                onSelect={() => {
                                    setValue(category.id)
                                    setOpen(false)
                                    sendDataUp?.(category.id)
                                    console.log(category.id)
                                }}
                                >
                                    {category.name}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === category.name ? "opacity-100" : "opacity-0"
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
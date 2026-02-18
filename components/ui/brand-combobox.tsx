"use client"

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { BrandComboboxInterface } from "@/lib/actions/brands/brand-interface";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./command";
import { CommandList } from "cmdk";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/lib/debounce";

interface BrandComboboxProps {
    brands: BrandComboboxInterface[]
    sendDataUp?: (name: string) => void
    handleClear?: () => void
    formData?: (id: string) => void 
    isLoading: boolean
}


export function BrandCombobox({ brands, sendDataUp, handleClear, formData, isLoading }: BrandComboboxProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | undefined>(undefined)
    const debouncedVal = useDebounce(value, 300);

    

    return (
        <div className="flex gap-1">
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button role="combobox" className={`md:min-w-70 min-w-50 ${isLoading ? "bg-gray-500" : ""}`} disabled={isLoading}>
                    {value
                    ? brands.find((brand) => brand.id === value)?.name
                    : "Select Brand"}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent >
                <Command>
                    <CommandInput placeholder="Search Brands" />
                    <CommandList className="max-h-70 overflow-y-auto">
                        <CommandEmpty>No Brands Found...</CommandEmpty>
                        <CommandGroup >
                            {brands.map((brand) => (
                                <CommandItem 
                                key={brand.id}
                                value={brand.id}
                                onSelect={() => {
                                    setValue(brand.id)
                                    setOpen(false)
                                    sendDataUp?.(brand.name)
                                    formData?.(brand.id)
                                }}
                                >
                                    {brand.name}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === brand.name ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
            <Button variant={"ghost"} onClick={() => {
                handleClear?.()
                setValue(undefined)
            }}>Clear</Button>
        </Popover>
        </div>
    )
}
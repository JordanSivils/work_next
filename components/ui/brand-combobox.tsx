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
    sendDataUp?: (key: string, val: string) => void
    handleClear?: () => void
    formData?: (val: string) => void 
    isLoading: boolean
}


export function BrandCombobox({ brands, sendDataUp, handleClear, formData, isLoading }: BrandComboboxProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | undefined>(undefined)
    const debouncedVal = useDebounce(value, 300);

    

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button role="combobox" className={isLoading ? "bg-gray-500" : ""} disabled={isLoading}>
                    {value
                    ? brands.find((brand) => brand.name === value)?.name
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
                                value={brand.name}
                                onSelect={(currentValue = brand.id) => {
                                    setValue(currentValue ?? "")
                                    setOpen(false)
                                    sendDataUp?.("brand", currentValue)
                                    formData?.(currentValue)
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
            }}>clear</Button>
        </Popover>
    )
}
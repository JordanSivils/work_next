"use client"

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Brand } from "@/lib/actions/brands/brand-interface";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./command";
import { CommandList } from "cmdk";
import { cn } from "@/lib/utils";



export function BrandCombobox({ brands }: { brands: Brand[]}) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string>("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button role="combobox" className="min-w-80">
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
                                onSelect={(currentValue) => {
                                    setValue(currentValue ?? "")
                                    setOpen(false)
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
        </Popover>
    )
}
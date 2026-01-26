"use client"

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./command";
import { CommandList } from "cmdk";
import { UserComboboxInterface } from "@/lib/actions/users/user-interface";
import { Button } from "./button";
import { useState } from "react";
import { useDebounce } from "@/lib/debounce";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserComboboxProps {
    users: UserComboboxInterface[]
    sendDataUp?: (key: string, val: string) => void
    handleClear?: () => void
    formData?: (val: string) => void 
    isLoading: boolean
}

export function UserCombobox({ users, sendDataUp, handleClear, formData, isLoading }: UserComboboxProps) {
    const [open, setOpen] = useState(false);
        const [value, setValue] = useState<string | undefined>(undefined)
        const debouncedVal = useDebounce(value, 300);

    return (
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button role="combobox" className={isLoading ? "bg-gray-500" : ""} disabled={isLoading}>
                    {value
                    ? users.find((user) => user.id === value)?.firstName
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
                            {users.map((user) => (
                                <CommandItem 
                                key={user.id}
                                value={user.id}
                                onSelect={(currentValue) => {
                                    setValue(currentValue ?? "")
                                    setOpen(false)
                                    sendDataUp?.("user", currentValue)
                                    formData?.(currentValue)
                                }}
                                >
                                    {`${user.firstName} ${user.lastName}`}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === user.firstName ? "opacity-100" : "opacity-0"
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
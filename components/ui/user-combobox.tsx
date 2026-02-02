"use client"

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./command";
import { CommandList } from "cmdk";
import { UserComboboxInterface } from "@/lib/actions/users/user-interface";
import { Button } from "./button";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserComboboxProps {
    users: UserComboboxInterface[]
    defaultValue?: string
    sendDataUp?: (key: string, val: string) => void
    handleClear?: () => void
    formData?: (val: string) => void 
    isLoading: boolean
}

export function UserCombobox({ users, sendDataUp, handleClear, defaultValue, formData, isLoading }: UserComboboxProps) {
    const reference = useRef(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (reference.current) reference
        reference.current === true
        if (defaultValue) setValue(defaultValue)
    }, [defaultValue])

     return (
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button type="button" role="combobox" className={isLoading ? "bg-gray-500" : ""} disabled={isLoading}>
                    {value
                    ? users.find((user) => user.id === value)?.firstName
                    : "Select User"}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent >
                <Command>
                    <CommandInput placeholder="Search Brands" />
                    <CommandList className="max-h-70 overflow-y-auto">
                        <CommandEmpty>No Users Found</CommandEmpty>
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
                                    console.log(currentValue)
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
            <Button variant={"ghost"} type="button" onClick={() => {
                handleClear?.()
                setValue(undefined)
            }}>clear</Button>
        </Popover>
    )
}
"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SupplierCombobox } from "@/components/ui/supplier-combobox";
import { Textarea } from "@/components/ui/textarea";
import { specialOrderCreate } from "@/lib/actions/special-order/create-special-order";
import { SpecialOrderCreate, specialOrderCreateSchema } from "@/lib/actions/special-order/special-order-interfaces";
import { Supplier } from "@/lib/actions/suppliers/supplier-interfaces";
import { notify } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlusCorner, Minus, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { Controller, SubmitHandler, useFieldArray, useForm, useWatch } from "react-hook-form";

interface SpecialOrderFormProps {
    suppliers: Supplier[]
}
export function SpecialOrderForm({ suppliers }: SpecialOrderFormProps) {
    const [open, setOpen] = useState(false)
    const addBtnRef = useRef<HTMLButtonElement>(null)
    const {
        register, 
        control,
        handleSubmit,
        reset,
        setValue
    } = useForm<SpecialOrderCreate>(({
        resolver: zodResolver(specialOrderCreateSchema),
        defaultValues: {
            items: [{ name: "", quantity: "", weight: "" }],
            customer: "",
            customerContact: "",
            orderStatus: "requested",
            recurring: false,
            existingItem: false
        }
    }))

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    })

    const onInvalid = (errs: any) => console.log("INVALID", errs)

    const onSubmit: SubmitHandler<SpecialOrderCreate> = async (data) => {
        console.log(data)
        try {
            await specialOrderCreate(data)
            notify.success("Special Order Created")
            reset()
            setOpen(false)
        } catch (error) {
            notify.error("Special order failed")
            console.error(error)
        }
    }

    const handleCombobox = (id: string) => {
        setValue("supplierId", id)
    }
    const handleSupplierClear = () => {
        setValue("supplierId", undefined)
    } 
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild><Button type="button" variant={"ghost"}><FilePlusCorner />Special Order</Button></DialogTrigger>
                <DialogContent className="max-w-fit! max-h-[90vh] overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Special Order Form</DialogTitle>
                        <DialogDescription>Create Special orders, and mark if they are recurring.</DialogDescription>
                    </DialogHeader>
                    <div>
                        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col gap-4 overflow-y-auto">
                        
                            {fields.map((field, index) => (
                            <div className="flex gap-2 border lg:border-none" key={field.id}>
                                <div className="flex gap-2 flex-col lg:flex-row p-2 lg:p-0">
                                    <Input {...register(`items.${index}.name`)} className="min-w-60" placeholder="Item Name"/>
                                    <Input {...register(`items.${index}.quantity`)} className="min-w-30" placeholder="Item Quantity"/>
                                    <Input {...register(`items.${index}.weight`)} className="min-w-30" placeholder="Item Weight"/>
                                </div>
                                <div className="flex flex-col md:flex-row gap-0.5">
                                    <Button
                                    onPointerDown={(e) => e.preventDefault()} 
                                    type="button" 
                                    size={"icon-sm"} 
                                    variant={"ghost"} 
                                    onClick={() => {
                                        append({name: "", quantity: "", weight: ""})
                                        requestAnimationFrame(() => addBtnRef.current?.focus())
                                    }} ><Plus /></Button>
                                {index > 0 ? <Button variant={"ghost"} size={"icon-sm"} type="button" onClick={() => remove(index)}><Minus /></Button> : null}
                                </div>
                            </div>
                            ))}
                            <div>
                                    <Controller
                                    name="existingItem"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex gap-2">
                                            <Checkbox
                                            checked={field.value ?? false}
                                            onCheckedChange={(v) => field.onChange(v === true)}
                                            />
                                            <Label>Does this product or all products exist in Pinogy?</Label>
                                        </div>
                                    )}
                                    />
                                </div>
                            <div className="flex gap-3 flex-col lg:flex-row">
                                <div className="flex flex-col gap-1 lg:flex-1 ">
                                    <Label>Customer</Label>
                                    <Input {...register("customer")} />
                                </div>  
                                <div className="flex flex-col gap-1 lg:flex-1">
                                    <Label>Customer Contact</Label>
                                    <Input {...register("customerContact")} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <Controller
                                    name="requestType"
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup orientation="vertical"  value={field.value} defaultValue="order" onValueChange={field.onChange}>
                                            <div className="flex gap-1.5">
                                                <Label>Check Price or Order Now:</Label>
                                                <div className="flex gap-1">
                                                    <RadioGroupItem id="order" value={"order"} />
                                                    <Label htmlFor="order">Order</Label>
                                                </div>
                                                <div className="flex gap-1">
                                                    <RadioGroupItem  id="cost" value={"cost"} />
                                                    <Label htmlFor="cost">Cost</Label>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label>Notes</Label>
                                    <Textarea {...register("notes")} placeholder="Order Notes..." />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label>Known Supplier? (This helps Emails find the right person)</Label>
                                    <SupplierCombobox suppliers={suppliers} sendDataUp={handleCombobox} handleClear={handleSupplierClear} />
                                </div>
                                <div>
                                    <Controller
                                    name="recurring"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex gap-2">
                                            <Checkbox
                                        checked={field.value ?? false}
                                        onCheckedChange={(v) => field.onChange(v === true)}
                                        />
                                        <Label>Is this a recurring order?</Label>
                                        </div>
                                    )}
                                    />
                                </div>
                                <div className="flex justify-end gap-4">
                                    <Button type="submit">Submit</Button>
                                    <DialogClose asChild>
                                        <Button type="button" variant={"outline"}>Cancel</Button>
                                    </DialogClose>
                                </div>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SupplierCombobox } from "@/components/ui/supplier-combobox"
import { Textarea } from "@/components/ui/textarea"
import { specialOrderPatch } from "@/lib/actions/special-order/patch-special-order"
import { SpecialOrderCreate, specialOrderCreateSchema, SpecialOrderPatch, SpecialOrderTableTwo } from "@/lib/actions/special-order/special-order-interfaces"
import { getSupplierData } from "@/lib/actions/suppliers/get-supplier-data"
import { Supplier } from "@/lib/actions/suppliers/supplier-interfaces"
import { notify } from "@/lib/toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogClose } from "@radix-ui/react-dialog"
import { Minus, Plus } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { useSpecialOrderContext } from "./special-order-context"
import { useRouter } from "next/navigation"

interface SpecialOrderDetailsProps {
    specOrds: SpecialOrderTableTwo
}

export function SpecialOrderDialog({ specOrds }: SpecialOrderDetailsProps) {
    const [open, setOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [suppliers, setSuppliers] = useState<Supplier[] | null>(null)

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const res = await getSupplierData()
                const mappedSupplier = res.data.map((sup): Supplier => ({
                id: sup.id,
                name: sup.name,
            }))
            setSuppliers(mappedSupplier)
            } catch (error) {
                console.error(error)
            }
        }
        fetchSuppliers()
    }, [])

    return (
        <Dialog modal={false} open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size={"sm"}>Details & Edit</Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-fit!">
                <DialogTitle>Special Order {editOpen ? "Edit" : "Details"}</DialogTitle>
                {editOpen && suppliers ? (
                    <SpecialOrderEdit suppliers={suppliers} specOrd={specOrds} submitSuccess={() => setEditOpen(false)} />
                ) : (
                    <SpecialOrderDetails specOrds={specOrds} />
                )}
                <div className="flex justify-end items-center gap-4">
                    <DialogClose asChild>
                        <Button variant="ghost" type="button">Done</Button>
                    </DialogClose>
                    {!editOpen ? (
                        <Button type="button" variant={"secondary"} onClick={() => setEditOpen(true)}>Edit</Button>
                    ): (
                        <Button type="button" variant={"secondary"} onClick={() => setEditOpen(false)}>Details</Button>
                    )}
                </div>
            </DialogContent>
            </Dialog>
    )
}

function SpecialOrderDetails({ specOrds }: SpecialOrderDetailsProps) {
    return (
        <Card>
            <CardContent>
                
                <div className="flex flex-col gap-4">    
                    <div>
                        <h1>Customer: {specOrds.customer}</h1> 
                        <h1>Contact: {specOrds.customerContact}</h1>
                        <p>Status: {specOrds.orderStatus}</p>
                        
                    </div>
                    <div className="flex items-center gap-1.5">
                        <p>Request: </p>
                        {specOrds.requestType === "cost" ? (
                            <p>Just Cost.</p>
                        ) : (
                            <p>Add to next order.</p>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <p>Ordered By:</p>
                        <p>{specOrds.Supplier?.User?.firstName} {specOrds.Supplier?.User?.lastName}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <p>Supplier:</p>
                        <p>{specOrds.Supplier?.name ?? "Unknown"}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <p>Created By:</p>
                        <p>{specOrds.User?.firstName} {specOrds.User?.lastName}</p>
                    </div>

                    <div className="flex flex-col">
                        <p>Notes:</p>
                        <p className="whitespace-pre-wrap">{specOrds.notes}</p>
                    </div>
                    <div>
                        {specOrds.existingItem ? (
                            <p>These Items Already Exist In Pinogy.</p>
                        ): (
                            <p>Some of these items do not exist in Pinogy yet.</p>
                        )}
                        </div>
                    <div className="flex flex-col gap-1">
                        <p>Products:</p>
                        {specOrds.items.map((item, index) => (
                            <div key={index} className="flex justify-start items-center gap-4 border-b">
                                <p>{index + 1}. Item: {item.name},</p>
                                <p>Quantity: {item.quantity},</p>
                                <p>Weight: {item.weight ?? "NA"}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function SpecialOrderEdit({ 
        suppliers, 
        specOrd,
        submitSuccess,
    } : {
        suppliers: Supplier[], 
        specOrd: SpecialOrderTableTwo,
        submitSuccess?: () => void
    }) {
    // const { refresh } = useSpecialOrderContext()
    const router = useRouter();
    const addBtnRef = useRef<HTMLButtonElement>(null)
        const {
            register, 
            control,
            handleSubmit,
            reset,
            setValue,
            formState: { dirtyFields, isDirty, isValid }
        } = useForm<SpecialOrderCreate>(({
            resolver: zodResolver(specialOrderCreateSchema),
            defaultValues: {
                items: specOrd.items,
                customer: specOrd.customer ?? "",
                notes: specOrd.notes ?? "",
                customerContact: specOrd.customerContact ?? "",
                orderStatus: specOrd.orderStatus,
                recurring: specOrd.recurring,
                requestType: specOrd.requestType,   
                existingItem: specOrd.existingItem ?? false
            }
        }))
    
        const { fields, append, remove } = useFieldArray({
            control,
            name: "items"
        })
    
        const onInvalid = (errs: any) => console.log("INVALID", errs)

        type DirtyFields<T> =
            T extends (infer U)[]
                ? Array<DirtyFields<U> | undefined> | true
                : T extends object
                ? { [K in keyof T]?: DirtyFields<T[K]> }
                : true;

        function getPatchVals<T>(
        dirtyFields: DirtyFields<T> | boolean | undefined,
        allFields: T
        ): Partial<T> {
        if (!dirtyFields) return {};
        if (dirtyFields === true) return allFields as any;

        // arrays: if dirtyFields is an array, return the whole array value
        if (Array.isArray(dirtyFields)) {
            return allFields as any;
        }

        // non-object leaf (shouldn't happen often with our DirtyFields, but safe)
        if (typeof dirtyFields !== "object") return {};

        const result: any = {};
        for (const key of Object.keys(dirtyFields) as Array<keyof typeof dirtyFields>) {
            const dirtyVal = (dirtyFields as any)[key];
            const fieldVal = (allFields as any)[key];

            if (!dirtyVal) continue;

            if (dirtyVal === true) {
            result[key] = fieldVal;
            continue;
            }

            if (Array.isArray(dirtyVal)) {
            // array dirty tracking -> easiest + correct for PATCH is take full array
            result[key] = fieldVal;
            continue;
            }

            const nested = getPatchVals(dirtyVal, fieldVal);
            if (nested && (typeof nested === "object") && Object.keys(nested as any).length > 0) {
            result[key] = nested;
            }
        }

        return result;
        }
    
        const onSubmit: SubmitHandler<SpecialOrderPatch> = async (data) => {
            const filteredData = getPatchVals<SpecialOrderPatch>(dirtyFields as any, data);
            if (!isDirty) return
            try {
                await specialOrderPatch(specOrd.id, filteredData)
                notify.success("Updated Successfully")
                router.refresh()
                submitSuccess?.()
            } catch (error) {
                notify.error("Special order failed")
                console.error(error)
            }
        }
    
        const handleCombobox = (id: string) => {
            setValue("supplierId", id, { shouldDirty: true})
        }
        const handleSupplierClear = () => {
            setValue("supplierId", undefined, { shouldDirty: true})
        } 
    return (
        <Card>
            <CardContent>
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
                        <SupplierCombobox suppliers={ suppliers } initValue={specOrd.Supplier?.id} sendDataUp={handleCombobox} handleClear={handleSupplierClear} />
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
                    <Button type="submit" disabled={!isDirty} className={!isDirty ? "bg-gray-500" : ""}>submit</Button>
                </div>
            </form>
            </CardContent>
        </Card>
    )
}
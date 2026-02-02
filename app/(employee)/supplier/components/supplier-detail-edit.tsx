import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserCombobox } from "@/components/ui/user-combobox";
import { SupplierPatch, supplierPatchSchema, SupplierTableRow } from "@/lib/actions/suppliers/supplier-interfaces";
import { patchSupplier } from "@/lib/actions/suppliers/update-supplier";
import { getAllUsers } from "@/lib/actions/users/get-users";
import { User, UserComboboxInterface } from "@/lib/actions/users/user-interface";
import { notify } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSupplierTableContext } from "./supplier-table-context";
import { CheckedState } from "@radix-ui/react-checkbox";

interface SupplierDetailEditProps {
    supplier: SupplierTableRow
    onEditSuccess?: () => void
}

export function SupplierDetailEdit({ supplier }: SupplierDetailEditProps) {
    const [open, setOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false);

    return (
        <Dialog modal={false} open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size={"sm"}>Details & Edit</Button>
            </DialogTrigger>
            <DialogContent className="">
                <DialogHeader><DialogTitle>Supplier Detials & Edit</DialogTitle></DialogHeader>
                {!editOpen ? <SupplierDetails supplier={supplier} /> : <SupplierEdit supplier={supplier} onEditSuccess={() => setEditOpen(false)} />}
                
                <div className="flex items-center justify-end gap-4">
                    {/* <Button onClick={onSubmit} disabled={submitting}>De-Activate</Button> */}
                    <DialogClose asChild><Button type="button" variant="outline">Close</Button></DialogClose>
                    <Button 
                    type='button' 
                    variant={"ghost"} 
                    onClick={() => setEditOpen((prev) => !prev)}>
                        {editOpen ? "Details" : "Edit"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}


function SupplierDetails({ supplier }: SupplierDetailEditProps) {
    return (
        <div>
            <ul>
                <li>{supplier.name}</li>
                <li>{supplier.orderDay}</li>
                <li>{supplier.User?.firstName} {supplier.User?.lastName}</li>
            </ul>
        </div>
    )
}

function SupplierEdit({ supplier, onEditSuccess }: SupplierDetailEditProps) {
    const { refresh } = useSupplierTableContext()
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState<UserComboboxInterface[]>([])
    const [checked, setChecked] = useState<boolean>(supplier.isActive)
    const {
        register,
        setValue,
        handleSubmit,
        formState: { isDirty, dirtyFields, isSubmitting }
    } = useForm<SupplierPatch>({
        resolver: zodResolver(supplierPatchSchema),
        defaultValues: {
            userId: supplier.User?.id,
            orderDay: supplier.orderDay ?? "",
            orderMinimum: supplier.orderMinimum ?? "",
            orderNotes: supplier.orderNotes ?? "",
            isActive: supplier.isActive
        }
    })

    const getPatchVals = (dirtyFields: object | boolean, allFields: object): object => {
        if (dirtyFields === true || Array.isArray(dirtyFields))  {
            return allFields
        }

        return Object.fromEntries(
            Object.keys(dirtyFields).map(key => [
            key,
            getPatchVals(dirtyFields[key as keyof typeof dirtyFields], allFields[key as keyof typeof allFields]),
            ])
        );
    }

    async function getUsers() {
        setLoading(true);
        try {
            const res = await getAllUsers()
            setUsers(res)
        } catch (error) {
            notify.error("Failed to fetch users")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUsers()
    }, [])
    
    const onSubmit: SubmitHandler<SupplierPatch> = async (data) => {
        const filteredData = getPatchVals(dirtyFields, data)
        if (!isDirty) return
        setLoading(true)
        try {
            await patchSupplier(supplier.id, filteredData)
            notify.success("Updated Supplier")
            refresh();
            onEditSuccess?.()
        } catch (error) {
            notify.error("error")
            throw new Error("Supplier Update Failed")
        }
    }

    const handleCheckChange = (next: CheckedState) => {
        const isChecked = next === true;
        setChecked(isChecked);
        setValue("isActive", isChecked, { shouldDirty: true, shouldValidate: true})
    };

    const handleUserSelect = (id: string) => {
        setValue("userId", id, { shouldDirty: true, shouldValidate: true})
    } 

    const handleUserClear = () => {
        setValue("userId", null, { shouldDirty: true, shouldValidate: true})
    }


    return (
        <div>
            <h1>{supplier.name}</h1>
            <form onSubmit={handleSubmit(onSubmit)} method="post" className="w-full">
                <div className="flex gap-4 w-full">
                    <div className="flex flex-col gap-4">
                        <Field>
                            <FieldLabel>Order Day</FieldLabel>
                            <Input type="text" {...register("orderDay")} placeholder="Order Day" />
                        </Field>
                        <Field>
                            <FieldLabel>Order Minimum</FieldLabel>
                            <Input type="text" {...register("orderMinimum")} placeholder="Price, Weight or None" />
                        </Field>
                        <Field>
                            <FieldLabel>Ordered By</FieldLabel>
                            <UserCombobox formData={handleUserSelect} handleClear={handleUserClear} defaultValue={supplier.User?.id} isLoading={loading} users={users} />
                        </Field>
                        <Field >
                            <div className="flex items-center gap-2">
                                <Checkbox id="check" checked={checked} onCheckedChange={handleCheckChange}/>
                                <FieldLabel htmlFor="check">Active</FieldLabel>
                            </div>
                        </Field>
                    </div>
                    <div className="flex-1 h-full">
                        <Field className="h-full">
                            <FieldLabel>Order Notes</FieldLabel>
                            <Textarea {...register("orderNotes")} placeholder="Order Notes" className="grow h-70" />
                        </Field>
                    </div>
                    <div>
                        <Button type="submit">Update</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
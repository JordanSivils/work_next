"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { patchUser } from "@/lib/actions/users/update-users";
import { UserPatch, userPatchSchema, UserTableRow } from "@/lib/actions/users/user-interface";
import { notify } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";


export function EmployeeEdit({user}: { user: UserTableRow}) {
    const [laoding, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { isDirty, isSubmitting, isSubmitted }
    } = useForm<UserPatch>({
        resolver: zodResolver(userPatchSchema),
        defaultValues: {
            email: user.email,
            phoneNumber: user.phoneNumber
        }
    })
    
    const onSubmit: SubmitHandler<UserPatch> = async (data) => {
        try {
            await patchUser(user.id, data)
            notify.success("Employee Updated");
            setOpen(false)
            router.refresh()
        } catch (error) {
            notify.error("Failed to Update Employee")
            throw new Error("Update Employee Failed")
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button type="button" variant={"ghost"}>Edit</Button></DialogTrigger>
            <DialogContent>
            <DialogHeader><DialogTitle>Edit Employee</DialogTitle></DialogHeader>
                <div className="flex flex-col gap-4">
                    <h1>{user.firstName} {user.lastName}</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input {...register("email")} id="email" type="text" placeholder="emal" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input {...register("phoneNumber")} id="phoneNumber" type="text" placeholder="phone" />
                        </div>
                        <div className="flex gap-4 justify-end">
                            <Button type="submit">Update</Button>
                            <DialogClose asChild><Button type="button" variant={"ghost"}>Cancel</Button></DialogClose>
                        </div>
                    </form>
                </div>
                
            </DialogContent>
        </Dialog>
    )
}
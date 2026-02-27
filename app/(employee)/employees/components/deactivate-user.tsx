"use client"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { useState } from "react"
import { notify } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { updateUserIsActive } from "@/lib/actions/users/update-users";
import { useRouter } from "next/navigation";

interface DeactivateUserProps {
    id: string
}

export function DeactivateUser({id}: DeactivateUserProps) {
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter()
    async function onSubmit() {
        setSubmitting(true)
        try {
            await updateUserIsActive(id, false)
            notify.success("Updated Employee");
            setOpen(false);
            router.refresh()
        } catch (error) {
            notify.error("Update Failed")
        } finally {
            setSubmitting(false)
        }
    }
    return (
        <>
        <Dialog modal={false} open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost">Deactivate</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
                <DialogTitle>Deactivate Brand</DialogTitle>
                <DialogDescription>
                    Are you sure you want to Deactivate This Brand?
                </DialogDescription>
            </DialogHeader>
                <div className="flex items-center justify-end gap-4">
                    <Button onClick={onSubmit} disabled={submitting}>De-Activate</Button>
                    <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}

export function ActivateUser({ id }: DeactivateUserProps) {
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter()
    async function onSubmit() {
        setSubmitting(true)
        try {
            await updateUserIsActive(id, true)
            notify.success("Updated Employee");
            setOpen(false);
            router.refresh()
        } catch (error) {
            notify.error("Update Failed")
        } finally {
            setSubmitting(false)
        }
    }
    return (
        <>
        <Dialog modal={false} open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost">Activate</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
                <DialogTitle>Activate Brand</DialogTitle>
                <DialogDescription>
                    Are you sure you want to Activate This Brand?
                </DialogDescription>
            </DialogHeader>
                <div className="flex items-center justify-end gap-4">
                    <Button onClick={onSubmit} disabled={submitting}>Activate</Button>
                    <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}
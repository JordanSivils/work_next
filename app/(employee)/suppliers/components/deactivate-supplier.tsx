"use client"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { useState } from "react"
import { notify } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { useSupplierTableContext } from "./supplier-table-context";
import { updateSupplierIsActive } from "@/lib/actions/suppliers/update-supplier";

interface DeactivateSupplierProps {
    id: string
}

export function DeactivateSupplier({id}: DeactivateSupplierProps) {
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false);
    const { refresh } = useSupplierTableContext()

    async function onSubmit() {
        setSubmitting(true)
        try {
            await updateSupplierIsActive(id, false)
            notify.success("Updated Brand");
            setOpen(false);
            refresh();
        } catch (error) {
            notify.error("Update Failed")
        } finally {
            setSubmitting(false)
        }
        
    }
    return (
        <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size={"sm"}>Deactivate</Button>
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

export function ActivateSupplier({ id }: DeactivateSupplierProps) {
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false);
    const { refresh } = useSupplierTableContext()

    async function onSubmit() {
        setSubmitting(true)
        try {
            await updateSupplierIsActive(id, true)
            notify.success("Updated Brand");
            setOpen(false);
            refresh();
        } catch (error) {
            notify.error("Update Failed")
        } finally {
            setSubmitting(false)
        }
    }
    return (
        <>
        <Dialog  open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size={"sm"}>Activate</Button>
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
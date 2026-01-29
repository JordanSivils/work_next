"use client"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { useState } from "react"
import { useBrandTableContext } from "./brand-table-context";
import { updateBrandInventoriedBy, updateBrandIsActive } from "@/lib/actions/brands/update-brands";
import { notify } from "@/lib/toast";
import { Button } from "@/components/ui/button";

interface DeactivateBrandProps {
    id: string
}

export function DeactivateBrand({id}: DeactivateBrandProps) {
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false);
    const { refresh } = useBrandTableContext()

    async function onSubmit() {
        setSubmitting(true)
        try {
            await updateBrandIsActive(id, false)
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

export function ActivateBrand({ id }: DeactivateBrandProps) {
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false);
    const { refresh } = useBrandTableContext()

    async function onSubmit() {
        setSubmitting(true)
        try {
            await updateBrandIsActive(id, true)
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
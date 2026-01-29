"use client"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createUsers } from "@/lib/actions/users/create-users";
import { Users } from "lucide-react";
import { useState } from "react";
import { notify } from "@/lib/toast";

export function SyncUsers() {
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    async function handleClick() {
        setSubmitting(true)
        try {
            await createUsers()
            notify.success("Users Synced")
            setOpen(false)
        } catch (error) {
            notify.error("Fail")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
        <Dialog modal={false} open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
            <Button variant="ghost"><Users />Sync Users</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
                <DialogTitle>Sync Users</DialogTitle>
                <DialogDescription>
                    Are You sure you want to Sync Clerk with ME DB?
                </DialogDescription>
            </DialogHeader>
                <div className="flex items-center justify-end gap-4">
                    <Button onClick={handleClick} disabled={submitting}>Sync</Button>
                    <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}
"use client"
import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,DialogTrigger, } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";


interface SidebarDialogWrapperProps {
    children: ReactNode
    btnLabel: ReactNode
    dialogTitle: string
    dialogDescription?: string
}

export function SidebarDialogWrapper({children, btnLabel, dialogTitle, dialogDescription}: SidebarDialogWrapperProps) {
      const [open, setOpen] = useState(false)
    return (
        <Dialog modal={false} open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost">{btnLabel}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-fit! max-h-screen overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogDescription>
                  {dialogDescription}
                </DialogDescription>
              </DialogHeader>
                  {children}
            </DialogContent>    
        </Dialog>
       
        
    )
}
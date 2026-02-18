import { ReactNode } from "react"
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./sheet"
import { Button } from "./button"
import { ListFilter } from "lucide-react"

interface SheetWrapperProps {
    children: ReactNode
}

export function SheetWrapper({ children }: SheetWrapperProps) {
    return (
        <Sheet modal={false}>
            <SheetTrigger asChild>
                <Button className="cursor-pointer" variant={`ghost`} size={`icon-sm`}><ListFilter /></Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>Filter Products</SheetTitle>
                </SheetHeader>
                <div className="p-4 flex flex-col gap-4">
                    {children}
                </div>
                
            </SheetContent>
        </Sheet>
    )
}
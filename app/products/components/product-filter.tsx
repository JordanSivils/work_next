import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BrandComboboxWrapper } from "../fetch-page";

export function ProductFilter() {
    return (
        <Sheet modal={false}>
            <SheetTrigger asChild>
                <Button>Filter Products</Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>Filter Products</SheetTitle>
                </SheetHeader>
                <div className="p-4 flex flex-col gap-4">
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground pb-2">Select Brand</p>
                        <BrandComboboxWrapper />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground">Select Category</p>
                        {/* brand combo box */}
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground">Select Supplier</p>
                        {/* brand combo box */}
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type='submit' className="cursor-pointer">Submit</Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button variant='outline' className="cursor-pointer">Cancel</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
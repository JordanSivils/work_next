import { BrandCombobox } from "@/components/ui/brand-combobox"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText } from "lucide-react"
import { ExcelPdfFormWrapper } from "./forms/excel-pdf-form-wrapper"

export function InventoryForm() {
  return (
    <Dialog modal={false}>
        <DialogTrigger asChild>
          <Button variant="ghost"><FileText />Inventory</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Get Inventory PDF</DialogTitle>
            <DialogDescription>
              Upload Excel
            </DialogDescription>
          </DialogHeader>
            <ExcelPdfFormWrapper />
        </DialogContent>
    </Dialog>
  )
}

"use client"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle,DialogTrigger, } from "@/components/ui/dialog"
import { FileText } from "lucide-react"
import { downloadPdf } from "@/components/downloading-pdf";
import { BrandCombobox } from "@/components/ui/brand-combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandComboboxInterface } from "@/lib/actions/brands/brand-interface";
import { parseExcel } from "@/lib/parse-excel";
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { notify } from "@/lib/toast";
import { UpdateBrandInventoried } from "@/lib/actions/brands/update-brands";
import { useState } from "react";
 
interface InventoryFormProps {
    brands: BrandComboboxInterface[]
}

const formInputs = z.object({
    excel: z
        .custom<FileList>((xl) => xl instanceof FileList, { message: "Please Upload a File"})
        .refine((xl) => xl.length === 1, { message: "Only 1 File Accepted"}),

    brand: z.string().min(1, { message: "Must Select a Brand"})
})
type FormInputs = z.infer<typeof formInputs>

export function InventoryForm({ brands }: InventoryFormProps) {
  const [open, setOpen] = useState(false)
  const { 
          register, 
          setValue, 
          handleSubmit,
          formState: { errors, isSubmitting, isDirty }     
      } = useForm<FormInputs>({
          resolver: zodResolver(formInputs),
          defaultValues: { brand: ""},
      });
  
      function handleBoxSelect(val: string) {
          setValue("brand", val, { shouldDirty: true, shouldValidate: true})
      }
  
      function handleOnClear() {
          setValue("brand", "")
      }
  
      const onSubmit: SubmitHandler<FormInputs> = async (data) => {
          try {
              const rows = await parseExcel(data.excel[0])
              await downloadPdf(rows, data.brand)
  
              await UpdateBrandInventoried(data.brand) // prisma func
              notify.success("Success")
              setOpen(false)
          } catch (error: any) {
              notify.error(error.message)           
          }
      }
  return (
    <Dialog modal={false} open={open} onOpenChange={setOpen}>
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
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                      <Label htmlFor="inventory-file">Excel File</Label>
                      <Input type="file" accept=".xlsx" id="inventory-file" {...register("excel")} />
                      {errors && <p className="text-sm text-purple-300">{errors.excel?.message}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                      <Label htmlFor="brand">Brand</Label>
                      <div className="flex ">
                          <BrandCombobox isLoading={isSubmitting} brands={brands} formData={handleBoxSelect} handleClear={handleOnClear} />
                      </div>
                      {errors && <p className="text-sm text-purple-300">{errors.brand?.message}</p>}
                  </div>
              </div>
              <div className="flex items-center justify-end gap-4">
                  <Button type="submit" className={isSubmitting || !isDirty ? "bg-gray-500" : ""} disabled={isSubmitting || !isDirty}>Submit</Button>
                  <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                  </DialogClose>
              </div>
            </form>
        </DialogContent>
    </Dialog>
  )
}

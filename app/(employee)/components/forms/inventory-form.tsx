"use client"
import {  DialogClose } from "@/components/ui/dialog"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 
interface InventoryFormProps {
    brands: BrandComboboxInterface[]
    sidebar: boolean
}

const formInputs = z.object({
    excel: z
        .custom<FileList>((xl) => xl instanceof FileList, { message: "Please Upload a File"})
        .refine((xl) => xl.length === 1, { message: "Only 1 File Accepted"}),

    brandId: z.uuid(),
    brandName: z.string().min(1)
})
type FormInputs = z.infer<typeof formInputs>

export function InventoryForm({ brands, sidebar }: InventoryFormProps) {
  const [open, setOpen] = useState(false)
  const { 
          register, 
          setValue, 
          reset,
          handleSubmit,
          formState: { errors, isSubmitting, isDirty }     
      } = useForm<FormInputs>({
          resolver: zodResolver(formInputs),
          defaultValues: { 
            brandName: "",
            brandId: ""
        },
      });
  
      function handleNameSelect(name: string) {
          setValue("brandName", name, { shouldDirty: true, shouldValidate: true})
      }

      function handleIdSelect(id: string) {
          setValue("brandId", id, { shouldDirty: true, shouldValidate: true})
      }
  
      function handleOnClear() {
          setValue("brandName", "")
          setValue("brandId", "")
      }
  
      const onSubmit: SubmitHandler<FormInputs> = async (data) => {
          try {
              const rows = await parseExcel(data.excel[0])
              await downloadPdf(rows, data.brandName)
  
              await UpdateBrandInventoried(data.brandId) // prisma func
              notify.success("Success")
              setOpen(false)
          } catch (error: any) {
              notify.error(error.message)           
          }
      }
  return (
    <Card>
        {!sidebar && (
            <CardHeader>
                <CardTitle>Inventory Tool</CardTitle>
                <CardDescription>Upload Excel & Get Inventory PDF</CardDescription>
            </CardHeader>
        )}
        <CardContent>
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
                            <BrandCombobox isLoading={isSubmitting} brands={brands} formData={handleIdSelect} sendDataUp={handleNameSelect} handleClear={handleOnClear} />
                        </div>
                        {errors && <p className="text-sm text-purple-300">{errors.brandName?.message}</p>}
                    </div>
                </div>
                <div className="flex items-center justify-end gap-4">
                    <Button type="submit" className={isSubmitting || !isDirty ? "bg-gray-500" : ""} disabled={isSubmitting || !isDirty}>Submit</Button>
                    {sidebar ? (
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                    ): (
                        <Button type="button" onClick={() => reset()} variant="outline">Reset Form</Button>
                    )}
                    
                </div>
            </form>
        </CardContent>
    </Card>
        
  )
}

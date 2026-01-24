"use client"
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
import { DialogClose } from "@/components/ui/dialog";
import { notify } from "@/lib/toast";
 
interface ExcelPdfFormProps {
    brands: BrandComboboxInterface[]
}

const formInputs = z.object({
    excel: z
        .custom<FileList>((xl) => xl instanceof FileList, { message: "Please Upload a File"})
        .refine((xl) => xl.length === 1, { message: "Only 1 File Accepted"}),

    brand: z.string().min(1, { message: "Must Select a Brand"})
})
type FormInputs = z.infer<typeof formInputs>

export function ExcelPdfForm({ brands }: ExcelPdfFormProps) {
    const { 
        register, 
        setValue, 
        handleSubmit,
        formState: { errors }     
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
            notify.success("Success")
        } catch (error: any) {
            notify.error(error.message)           
        }
        
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="inventory-file">Excel File</Label>
                    <Input type="file" id="inventory-file" {...register("excel")} />
                    {errors && <p className="text-sm text-purple-300">{errors.excel?.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="brand">Brand</Label>
                    <div className="flex ">
                        <BrandCombobox brands={brands} formData={handleBoxSelect} handleClear={handleOnClear} />
                    </div>
                    {errors && <p className="text-sm text-purple-300">{errors.brand?.message}</p>}
                </div>
            </div>
            <div>
                <Button type="submit">Submit</Button>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
            </div>
            
        </form>
    ) 
}
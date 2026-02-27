"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { postDataToServer } from "@/lib/actions/client-side.ts/submit-form";
import { notify } from "@/lib/toast";
import { Label } from "@radix-ui/react-label";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";

export interface CsvInterface {
    file: FileList
}
const formInputs = z.object({
    file: z
        .custom<FileList>((xl) => xl instanceof FileList, { message: "Please Upload a File"})
        .refine((xl) => xl.length === 1, { message: "Only 1 File Accepted"})
})
type FormInputs = z.infer<typeof formInputs>
export function CsvForm() {
    const [open, setOpen] = useState(false)

    const {
            register,
            handleSubmit,
            formState: { errors, isSubmitting, isDirty}
        } = useForm<FormInputs>({
            resolver: zodResolver(formInputs)
        })
    
        const onSubmit: SubmitHandler<FormInputs> = async (data) => {
            const file = data.file[0]
            console.log(file)
            try {
                await postDataToServer(file)
                notify.success("File processed successfully")
                setOpen(false)
            } catch (error) {
                notify.error("That didnt work")
            }
        }
        
    return (
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="file">CSV</Label>
                        <Input type="file" accept=".csv" placeholder="Select CSV" {...register("file")} />
                    </div>
                    <div className="flex items-center justify-end gap-4">
                        <Button type="submit" className={isSubmitting || !isDirty ? "bg-gray-500" : ""}>Send</Button>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">Cancel</Button>
                        </DialogClose>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
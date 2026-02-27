import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

type OrderStatus = "requested" | "ordered" | "rejected" | "received" | "shorted";

interface OrderStatusSelectProps {
  initVal: OrderStatus | null;
  formData?: (val: OrderStatus) => void;
}

export function OrderStatusSelect({ initVal, formData }: OrderStatusSelectProps) {
    const [value, setValue] = useState<OrderStatus | undefined>(initVal ?? undefined);
    return (
        <Select 
        value={value ?? undefined}
        onValueChange={(v) => {
            const next = v as OrderStatus;
            setValue(next);
            formData?.(next);
        }}
        >
            <SelectTrigger className="w-full max-w-48">
                <SelectValue>{value}</SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Order Status</SelectLabel>
                <SelectItem value="requested">Requsted</SelectItem>
                <SelectItem value="ordered">Ordered</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="shorted">Shorted</SelectItem>
                <SelectItem value="fullfilled">Fullfilled</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
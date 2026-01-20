"use client"
import { Button } from "@/components/ui/button"
import { SortHeader } from "@/components/ui/sort-header-button"
import { Product } from "@/lib/actions/products/product-interfaces"
import { type ColumnDef } from "@tanstack/react-table"
import { ArrowRight } from "lucide-react"
import Link from "next/link"


export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "description",
        header: ({ column }) => {
            return (
                <SortHeader field="description" label="Description"/>
            )
        }
    }, {
        accessorKey: "available",
        header: ({ column }) => {
            return (
                <SortHeader field="available" label="Available"/>
            )
        }
    }, {
        accessorKey: "category",
        header: "Category"
    },
    {
        id: "Details",
        header: "Details",
        cell: ({ row }) => {
            return (
                <Link href={`/products/${row.original.id}`}>
                    <Button variant={"ghost"}>
                        <ArrowRight />
                    </Button>
                </Link>
                
            )
        }
    }
]
"use client"

import { Button } from "@/components/ui/button";
import { SortHeader } from "@/components/ui/sort-header-button";
import { Brand } from "@/lib/actions/brands/brand-interface";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<Brand>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <SortHeader field="name" label="Name" />
            )
        }
    },
    {
        accessorKey: "itemCount",
        header: "Product Count"
    },
    {
        header: "Details",
        cell: ({ row }) => {
            return (
                <Link href={`/brand/${row.original.id}`}>
                    <Button variant={"ghost"}><ArrowRight /></Button>
                </Link>
            )
            
        }
    }
]
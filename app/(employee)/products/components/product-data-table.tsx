"use client"
import { BrandTableRow } from "@/lib/actions/brands/brand-interface"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react"
import { ProductTableRow } from "@/lib/actions/products/product-interfaces";
import { useProductContext } from "./product-table-context";

interface CoumnDef<T> {
  key: keyof T
  label: string
  sortable: boolean
}

const columns: CoumnDef<ProductTableRow>[] = [
  { key: "description", label: "Description", sortable: true},
  { key: "available", label: "Available", sortable: true},
  { key: "margin", label: "Margin", sortable: true},
  { key: "categoryId", label: "Category", sortable: false},
  { key: "details" as keyof ProductTableRow, label: "Details", sortable: false},
]

export function ProductDataTable() {
  const { products, loading, refresh, sortDir, setSortKey, setSortDir} = useProductContext()
  const [active, setActive] = useState<string | null>(null);
  
  return (
    <div className='space-y-4'>
      <div className='relative'>
        {loading && (
          <div className='absolute inset-0 bg-black/50 z-10 flex items-center justify-center pointer-events-none'>
            <h3>loading</h3>
          </div>
        )}

        <Table className='relative'>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                >
                  <div className='flex items-center gap-2'>
                    <span>{column.label}</span>
                    {column.sortable && (
                      <>
                        <Button 
                        variant={"ghost"} 
                        size={"icon-sm"}
                        onClick={() => {
                          setSortKey(column.key)
                          setSortDir(sortDir === "asc" ? "desc" : "asc")
                        }}
                        >
                          <ArrowUpDown size={14} />
                        </Button>
                      </>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='text-center py-8'
                >
                  <h3>Nothing to see here</h3>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.available}</TableCell>
                    <TableCell> {product.margin?.toFixed(2)}%</TableCell>
                    <TableCell>{product.Category?.name}</TableCell>
                    <TableCell className='w-[1%] whitespace-nowrap'>
                      <Button variant="ghost" type="button">Details</Button>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
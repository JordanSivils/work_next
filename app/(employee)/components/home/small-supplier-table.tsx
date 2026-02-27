"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SmallSupplier, SupplierTableRow } from "@/lib/actions/suppliers/supplier-interfaces";

interface ColumnDef<T> {
  key: keyof T
  label: string
  sortable: boolean
}

const columns: ColumnDef<SupplierTableRow>[] = [
    { key: "name", label: "Name", sortable: true},
    { key: "specialOrderCount" as keyof SupplierTableRow, label: "Special Orders", sortable: true},
]

interface SmallBrandTableProps {
  suppliers: SmallSupplier[]
}
export function SmallSupplierTable({ suppliers }: SmallBrandTableProps) {
  
  return (
    <div className='space-y-4'>
      <div className='relative'>
        <Table className='relative'>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                >
                  <div className='flex items-center gap-2'>
                    {column.label}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='text-center py-8'
                >
                  <h3>Nothing to see here</h3>
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.specialorders}</TableCell>
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
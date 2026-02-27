"use client"
import { BrandTableRow, SmallBrand } from "@/lib/actions/brands/brand-interface"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CoumnDef<T> {
  key: keyof T
  label: string
  sortable: boolean
}

const columns: CoumnDef<BrandTableRow>[] = [
  { key: "name", label: "Name", sortable: true},
  { key: "lastInventoriedAt", label: "Last Inventory", sortable: true},
]

interface SmallBrandTableProps {
  brands: SmallBrand[]
}
export function SmallBrandTable({ brands}: SmallBrandTableProps) {
  
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
            {brands.length === 0 ? (
              null
            ) : (
              brands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell>{brand.name}</TableCell>
                    <TableCell>{brand.lastInventoriedAt?.toDateString()}</TableCell>
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
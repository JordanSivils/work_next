"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUpDown, Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSupplierTableContext } from './supplier-table-context';
import { SupplierTableRow } from '@/lib/actions/suppliers/supplier-interfaces';
import { ActivateSupplier, DeactivateSupplier } from './deactivate-supplier';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SupplierDetailEdit } from './supplier-detail-edit';

interface ColumnDef<T> {
  key: keyof T
  label: string
  sortable: boolean
}

const columns: ColumnDef<SupplierTableRow>[] = [
    { key: "name", label: "Name", sortable: true},
    { key: "specialOrderCount" as keyof SupplierTableRow, label: "Special Orders", sortable: true},
    { key: "User", label: "Ordered By", sortable: false},
    { key: "actions" as keyof SupplierTableRow, label: "Actions", sortable: false},
]


export function SupplierDataTable() {
    const { suppliers, loading, sortKey, refresh, sortDir, setSortKey, setSortDir} = useSupplierTableContext()
    
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
              suppliers.map((supplier) =>  (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier._count.SpecialOrder}</TableCell>
                    <TableCell>{supplier.User?.firstName} {supplier.User?.lastName}</TableCell>
                    <TableCell className='w-[1%] whitespace-nowrap'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button type='button' variant="ghost"><Ellipsis /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel className='text-muted-foreground'>Actions</DropdownMenuLabel>
                          <div><SupplierDetailEdit supplier={supplier} /></div>
                          <div>{supplier.isActive ? <DeactivateSupplier id={supplier.id} /> : <ActivateSupplier id={supplier.id} />}</div>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
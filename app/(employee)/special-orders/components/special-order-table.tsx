"use client"

import { specialOrderItemsArray, specialOrderItemSchema, SpecialOrderTableRow, SpecialOrderTableTwo } from "@/lib/actions/special-order/special-order-interfaces"
import { useSpecialOrderContext } from "./special-order-context"
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
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from "react";
import { SpecialOrderDialog } from "./special-order-details";
import { notify } from "@/lib/toast";
import { specialOrderStatusPatch } from "@/lib/actions/special-order/patch-special-order";
import { OrderStatus } from "@/app/generated/prisma/enums";
import { OrderStatusSelect } from "./order-status-select";

interface ColumnDef<T> {
  key: keyof T
  label: string
  sortable: boolean
}

const columns: ColumnDef<SpecialOrderTableRow>[] = [
    { key: "customer", label: "Customer", sortable: false},
    { key: "createdAt", label: "Created", sortable: true},
    { key: "orderStatus", label: "Status", sortable: true},
    { key: "Supplier", label: "Ordered By", sortable: false},
    { key: "actions" as keyof SpecialOrderTableTwo, label: "Actions", sortable: false},
]

export function SpecialOrderTable() {
    const { specialOrders, loading, refresh, setSortDir, setSortKey, sortDir} = useSpecialOrderContext()
    const [activeRow, setActiveRow] = useState<string | null>(null);
    const [newStatus, setNewStatus] = useState<OrderStatus | null>(null)
    
    async function handleSave() {
      if (!activeRow || !newStatus) return null
      try {
          await specialOrderStatusPatch(activeRow, newStatus)
          notify.success("Updated");
          setActiveRow(null);
          setNewStatus(null);
          refresh();
      } catch (error) {
        notify.error("Failed to update")
      }
    }
    
    function handleNewStatus(stat: OrderStatus) {
      setNewStatus(stat)
    }

    function handleCancel() {
        setActiveRow(null);
        setNewStatus(null);
    }

    function toSpecialOrderTableTwo(row: SpecialOrderTableRow): SpecialOrderTableTwo {
    const parsed = specialOrderItemsArray.safeParse(row.items ?? []);
    return {
        ...row,
        items: parsed.success ? parsed.data : [],
    };
    }

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
            {specialOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='text-center py-8'
                >
                  <h3>Nothing to see here</h3>
                </TableCell>
              </TableRow>
            ) : (
              specialOrders.map((specOrd) => specOrd.id === activeRow ? (
                <TableRow key={specOrd.id}>
                      <TableCell>{specOrd.customer}</TableCell>
                      <TableCell>{specOrd.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell><OrderStatusSelect formData={handleNewStatus} initVal={specOrd.orderStatus}/></TableCell>
                      <TableCell>{specOrd.Supplier?.User?.firstName} {specOrd.Supplier?.User?.lastName}</TableCell>
                      <TableCell className='w-[1%] whitespace-nowrap'>
                        <Button variant="ghost" onClick={handleSave}>Save</Button>
                      </TableCell>
                      <TableCell className="w-[2%] whitespace-nowrap"><Button variant="ghost" onClick={handleCancel}>Cancel</Button></TableCell>
                  </TableRow>
              ) : (
                  <TableRow key={specOrd.id}>
                    <TableCell>{specOrd.customer}</TableCell>
                    <TableCell>{specOrd.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell>{specOrd.orderStatus}</TableCell>
                    <TableCell>{specOrd.Supplier?.User?.firstName} {specOrd.Supplier?.User?.lastName}</TableCell>
                    <TableCell className='w-[1%] whitespace-nowrap'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button type='button' variant="ghost"><Ellipsis /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel className='text-muted-foreground'>Actions</DropdownMenuLabel>
                          {specOrd.items && (
                            <div><SpecialOrderDialog specOrds={toSpecialOrderTableTwo(specOrd)} /></div>
                          )}
                          <div><Button type="button" onClick={() => {
                            setActiveRow(specOrd.id)
                          }}>Update Status</Button></div>
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
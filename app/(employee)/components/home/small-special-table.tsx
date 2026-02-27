"use client"
import { OrderStatus } from '@/app/generated/prisma/enums';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { specialOrderItemsArray, SpecialOrderTableRow, SpecialOrderTableTwo } from '@/lib/actions/special-order/special-order-interfaces';
import { useState } from 'react';
import { specialOrderStatusPatch } from '@/lib/actions/special-order/patch-special-order';
import { notify } from '@/lib/toast';
import { OrderStatusSelect } from '../../special-orders/components/order-status-select';
import { Button } from '@/components/ui/button';
import { SpecialOrderDialog } from '../../special-orders/components/special-order-details';
import { Ellipsis } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ColumnDef<T> {
  key: keyof T
  label: string
  sortable: boolean
}

const columns: ColumnDef<SpecialOrderTableRow>[] = [
    { key: "customer", label: "Customer", sortable: false},
    { key: "createdAt" , label: "Created", sortable: false},
    { key: "orderStatus", label: "Status", sortable: false},
    { key: "action" as keyof SpecialOrderTableRow, label: "Actions", sortable: false}
]

interface SmallSpecialTableProps {
  foundSpecOrds: SpecialOrderTableRow[]
  
}

export function SmallSpecialTable({ foundSpecOrds }: SmallSpecialTableProps ) {
    const [activeRow, setActiveRow] = useState<string | null>(null);
    const [newStatus, setNewStatus] = useState<OrderStatus | null>(null);
    const router = useRouter();

    async function handleSave() {
          if (!activeRow || !newStatus) return null
          try {
              await specialOrderStatusPatch(activeRow, newStatus)
              notify.success("Updated");
              setActiveRow(null);
              setNewStatus(null);
              router.refresh();
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
        <div className='flex flex-col gap-4'>
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
                        {foundSpecOrds.length === 0 ? (
                       null
                        ) : (
                        foundSpecOrds.map((specOrd) => specOrd.id === activeRow ? (
                            <TableRow key={specOrd.id}>
                                <TableCell>{specOrd.customer}</TableCell>
                                <TableCell>{specOrd.createdAt.toLocaleDateString()}</TableCell>
                                <TableCell><OrderStatusSelect formData={handleNewStatus} initVal={specOrd.orderStatus}/></TableCell>
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

            
        </div>
        
    )
}

interface UnknownSpecialOrderProps {
    unknownSpecOrds: SpecialOrderTableRow[]
}

export function UnknownSpecialOrder({ unknownSpecOrds }: UnknownSpecialOrderProps) {
    const [activeRow, setActiveRow] = useState<string | null>(null);
    const [newStatus, setNewStatus] = useState<OrderStatus | null>(null);
    const router = useRouter();

    async function handleSave() {
          if (!activeRow || !newStatus) return null
          try {
              await specialOrderStatusPatch(activeRow, newStatus)
              notify.success("Updated");
              setActiveRow(null);
              setNewStatus(null);
              router.refresh();
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
                <h1>Unkown Supplier</h1>
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
                        {unknownSpecOrds.length === 0 ? (
                        null
                        ) : (
                        unknownSpecOrds.map((specOrd) => specOrd.id === activeRow ? (
                            <TableRow key={specOrd.id}>
                                <TableCell>{specOrd.customer}</TableCell>
                                <TableCell>{specOrd.createdAt.toLocaleDateString()}</TableCell>
                                <TableCell><OrderStatusSelect formData={handleNewStatus} initVal={specOrd.orderStatus}/></TableCell>
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

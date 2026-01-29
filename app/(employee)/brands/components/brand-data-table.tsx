"use client"
import { BrandTableRow } from "@/lib/actions/brands/brand-interface"
import { useBrandTableContext } from "./brand-table-context"
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
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { UserCombobox } from "@/components/ui/user-combobox";
import { UserComboboxInterface } from "@/lib/actions/users/user-interface";
import { ActivateBrand, DeactivateBrand } from "./deactivate-brand";
import { updateBrandInventoriedBy } from "@/lib/actions/brands/update-brands";
import { notify } from "@/lib/toast";

interface CoumnDef<T> {
  key: keyof T
  label: string
  sortable: boolean
}

const columns: CoumnDef<BrandTableRow>[] = [
  { key: "name", label: "Name", sortable: true},
  { key: "inventoriedById", label: "User", sortable: false},
  { key: "lastInventoriedAt", label: "Last Inventory", sortable: true},
  { key: "actions" as keyof BrandTableRow, label: "", sortable: false},
  { key: "active" as keyof BrandTableRow, label: "Deactivate", sortable: false},
]

export function BrandTable({ users }: {users: UserComboboxInterface[]}) {
  const { brands, loading, sortKey, refresh, sortDir, setSortKey, setSortDir} = useBrandTableContext()
  const [active, setActive] = useState<string | null>(null);
  const [thisUser, setThisUser] = useState<string | null>(null)

  function handleSetUser(id: string) {
    setThisUser(id)
  }

  async function handleSave() {
    if (!active || !thisUser) return null
    try {
        await updateBrandInventoriedBy(active, thisUser)
        notify.success("Updated");
        setActive(null);
        setThisUser(null);
        refresh();
        // console.log(thisUser);
    } catch (error) {
      notify.error("Failed to update")
    }
  }

  function handleCancel() {
      setActive(null)
      setThisUser(null)
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
            {brands.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='text-center py-8'
                >
                  <h3>Nothing to see here</h3>
                </TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => brand.id === active ? (
                  
                      <TableRow key={brand.id}>
                        <TableCell>{brand.name}</TableCell>
                        <TableCell><UserCombobox isLoading={false} users={users} formData={handleSetUser}/></TableCell>
                        <TableCell>{brand.lastInventoriedAt?.toDateString()}</TableCell>
                        <TableCell className='w-[1%] whitespace-nowrap'>
                          <Button variant="ghost" onClick={handleSave}>Save</Button>
                        </TableCell>
                        <TableCell className="w-[2%] whitespace-nowrap"><Button variant="ghost" onClick={handleCancel}>Cancel</Button></TableCell>
                      </TableRow>
                ) : (
                  <TableRow key={brand.id}>
                    <TableCell>{brand.name}</TableCell>
                    <TableCell>{brand.user?.firstName} {brand.user?.lastName}</TableCell>
                    <TableCell>{brand.lastInventoriedAt?.toDateString()}</TableCell>
                    <TableCell className='w-[1%] whitespace-nowrap'>
                      <Button variant="ghost" onClick={() => setActive(brand.id)}>Edit</Button>
                    </TableCell>
                    <TableCell className="w-[2%] whitespace-nowrap">{brand.isActive ? <DeactivateBrand id={brand.id} /> : <ActivateBrand id={brand.id} />}</TableCell>
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

function ActiveRow({brand}: { brand: BrandTableRow}) {
  return (
    <form>
      <TableRow>
        <TableCell>{brand.name}</TableCell>
        <TableCell>{}</TableCell>
      </TableRow>
    </form>
  )
}
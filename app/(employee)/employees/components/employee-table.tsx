"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UserTableRow } from "@/lib/actions/users/user-interface";
import { updateBrandInventoriedBy } from "@/lib/actions/brands/update-brands";
import { notify } from "@/lib/toast";
import { ActivateUser, DeactivateUser } from "./deactivate-user";
import { EmployeeEdit } from './employee-edit';

interface CoumnDef<T> {
  key: keyof T
  label: string
}

const columns: CoumnDef<UserTableRow>[] = [
  { key: "name" as keyof UserTableRow, label: "Name",},
  { key: "email", label: "Email"},
  { key: "phoneNumber", label: "Phone #"},
  { key: "actions" as keyof UserTableRow, label: ""},
  { key: "active" as keyof UserTableRow, label: "Deactivate"},
]

export function UserTable({ users }: {users: UserTableRow[]}) {
  const [active, setActive] = useState<string | null>(null);
  const [thisUser, setThisUser] = useState<string | null>(null)

  async function handleSave() {
    if (!active || !thisUser) return null
    try {
        await updateBrandInventoriedBy(active, thisUser)
        notify.success("Updated");
        setActive(null);
        setThisUser(null);
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
        <Table className='relative'>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                >
                  <div className='flex items-center gap-2'>
                    <span>{column.label}</span>
                    
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='text-center py-8'
                >
                  <h3>Nothing to see here</h3>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => user.id === active ? (
                <form>
                 <TableRow key={user.id}>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell className='w-[1%] whitespace-nowrap'>
                      <Button variant="ghost" onClick={handleSave}>Save</Button>
                    </TableCell>
                    <TableCell className="w-[2%] whitespace-nowrap"><Button variant="ghost" onClick={handleCancel}>Cancel</Button></TableCell>
                  </TableRow>
                </form>
                ) : (
                  <TableRow key={user.id}>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell className='w-[1%] whitespace-nowrap'>
                      <EmployeeEdit user={user} />
                    </TableCell>
                    <TableCell className="w-[2%] whitespace-nowrap">{user.isActive ? <DeactivateUser id={user.id} /> : <ActivateUser id={user.id} />}</TableCell>
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
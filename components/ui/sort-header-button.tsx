"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

export function SortHeader({ field, label }: { field: string; label: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, startTransition] = useTransition()

  function onSort() {
    const params = new URLSearchParams(searchParams.toString())

    const currentSort = params.get("sort")
    const currentDir = params.get("dir")

    const nextDir = currentSort !== field ? "asc" : currentDir === "asc" ? "desc" : "asc"

    params.set("sort", field)
    params.set("dir", nextDir)
    params.set("page", "1")

    startTransition(() => {
      void router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <Button variant="ghost" onClick={onSort} disabled={isSubmitting} className={isSubmitting ? "hover:bg-transparent text-muted-foreground opacity-50 pointer-events-none" : ""}>
      {label}
      <ArrowUpDown />
    </Button>
  )
}
import { useDebounce } from "@/lib/debounce"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { Input } from "./input"

interface DebouncedInputProps {
    sendChange: (val: string) => void
    placeholder: string
    initValue?: string
}

export function DebouncedInput({ sendChange, placeholder, initValue = "" }: DebouncedInputProps) {
    const [search, setSearch] = useState(initValue)
    const debouncedSearch = useDebounce(search)

    const didMount = useRef(false)

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value)
    }

    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true
            return
        }
        sendChange(debouncedSearch)
    }, [debouncedSearch])
    
    return (
        <Input className="max-w-100" value={search} onChange={handleChange} placeholder={placeholder}  />
    )
}
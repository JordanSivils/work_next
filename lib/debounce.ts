import { useEffect, useState } from "react";

export function useDebounce<T>(val: T, delay: number) {
    const [debouncedVal, setDebouncedVal] = useState(val);

    useEffect(() => {
        const time = setTimeout(() => {
            setDebouncedVal(val)
        }, delay)
        return () => clearTimeout(time)
    }, [val, delay])
    return debouncedVal
}
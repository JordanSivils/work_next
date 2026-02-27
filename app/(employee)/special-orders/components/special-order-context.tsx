"use client"
import { SortDir } from "@/lib/actions/brands/get-brand-data";
import { getSpecialOrderData } from "@/lib/actions/special-order/get-special-order";
import { SpecialOrderQuery, SpecialOrderTableRow } from "@/lib/actions/special-order/special-order-interfaces";
import { debounce } from "lodash";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

interface SpecialOrderContextValue {
    sortKey: keyof SpecialOrderTableRow
    setSortKey: (key: keyof SpecialOrderTableRow) => void

    sortDir: SortDir;
    setSortDir: (dir: SortDir) => void

    userId: string | undefined
    setUserId: (id: string | undefined) => void

    supplierId: string | undefined
    setSupplierId: (id: string | undefined) => void
    
    page: number
    setPage: (val: number) => void

    totalPages: number
    specialOrders: SpecialOrderTableRow[]
    totalSpecialOrders: number
    loading: boolean

    reset: () => void
    refresh: () => void
    nextPage: () => void
    prevPage: () => void
} 

const SpecialOrderTableContextInternal = createContext<SpecialOrderContextValue | undefined>(undefined)
const defaultSortKey = "createdAt"
const defaultSortDir = "asc"
const defaultPage = 1
const defaultPageSize = 25

export function SpecialOrderTableContext({
    children,
    specialOrders: initialSpecialOrders,
    specialOrderCount: initialSpecialOrderCount
}: {
    children: ReactNode,
    specialOrders: SpecialOrderTableRow[],
    specialOrderCount: number
}) {
    const [loading, setLoading] = useState<boolean>(false);
    const [sortKey, setSortKey] = useState<keyof SpecialOrderTableRow>(defaultSortKey);
    const [sortDir, setSortDir] = useState<SortDir>(defaultSortDir);
    const [page, setPage] = useState<number>(defaultPage);
    const [totalSpecialOrders, setTotalSpecialOrders] = useState<number>(initialSpecialOrderCount);
    const [specialOrders, setSpecialOrders] = useState<SpecialOrderTableRow[]>(initialSpecialOrders);
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [supplierId, setSupplierId] = useState<string | undefined>(undefined);
    const [limit] = useState(defaultPageSize)

    const isInitialMount = useRef(true);

    const totalPages = Math.ceil(totalSpecialOrders / limit);

    const sort: SpecialOrderQuery["sortKey"] = sortKey === "createdAt" ? "createdAt" : "orderStatus";
    const query = useMemo<SpecialOrderQuery>(() => ({
        sortKey: sort,
        sortDir,
        page,
        userId,
        supplierId,
        limit
    }), [sort, sortDir, page, userId, supplierId, limit])

    const debouncedFetch = useMemo(() => debounce(async (q: SpecialOrderQuery) => {
        try {
            const res = await getSpecialOrderData(q);
            setSpecialOrders(res.data);
            setTotalSpecialOrders(res.total);
        } catch (error) {
            console.error("error fetching special orders", error)
        } finally {
            setLoading(false)
        }
    }, 300), []);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
            return
        }
        setLoading(true);
        debouncedFetch(query);
    }, [query, debouncedFetch]);

    useEffect(() => {
        return () => {
            debouncedFetch.cancel();
            isInitialMount.current = true
        }
    }, [debouncedFetch]);

    const handleSetPage = useCallback((newPage: number) => {
        const clamped = Math.max(1, Math.min(newPage, totalPages))
        setPage(clamped)
    }, [totalPages])

    const handleNextPage = useCallback(() => {
        setPage((prevPage) => Math.min(prevPage + 1, totalPages))
    }, [totalPages])

    const handlePrevPage = useCallback(() => {
        setPage((prevPage) => Math.max(prevPage - 1, 1))
    }, [])

    const handleSetUserId = useCallback((id: string | undefined) => {
        setUserId(id);
        setPage(defaultPage)
    }, [])

    const handleSetSupplierId = useCallback((id: string | undefined) => {
        setSupplierId(id);
        setPage(defaultPage)
    }, [])

    const handleRest = useCallback(() => {
        setSortKey(defaultSortKey);
        setSortDir(defaultSortDir);
        setPage(defaultPage);
    }, [])

    const handleRefresh = useCallback(async () => {
        setLoading(true);
        debouncedFetch.cancel();

        try {
            const res = await getSpecialOrderData(query)
            setSpecialOrders(res.data);
            setTotalSpecialOrders(res.total);
        } catch (error) {
            console.error("Failed to fetch brands", error)
        } finally {
            setLoading(false)
        }
    }, [query]);

    const val: SpecialOrderContextValue = {
        sortDir,
        sortKey,
        page,
        specialOrders,
        totalSpecialOrders,
        loading,
        supplierId,
        userId,
        setSortDir,
        setSortKey,
        setSupplierId: handleSetSupplierId,
        setUserId: handleSetUserId,
        setPage: handleSetPage,
        nextPage: handleNextPage,
        prevPage: handlePrevPage,
        refresh: handleRefresh,
        reset: handleRest,
        totalPages
    };

    return (
        <SpecialOrderTableContextInternal.Provider value={val}>
            {children}
        </SpecialOrderTableContextInternal.Provider>
    )
};

export function useSpecialOrderContext() {
    const context = useContext(SpecialOrderTableContextInternal)
    if (context === undefined) throw new Error("useTable must be used inside of specialOrderTableContext")
    return context
}
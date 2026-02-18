"use client"

// table: name, special order count, Orderedby (user), dialog
// supplier dialog: send all & user, fetch special orders for a table/card structure
// sort: name, specialOrderCount?, debounce search supplier name
// filter: special orders > 0; user

import { SortDir } from "@/lib/actions/brands/get-brand-data";
import { getSupplierData } from "@/lib/actions/suppliers/get-supplier-data";
import { SupplierQuery, SupplierTableRow } from "@/lib/actions/suppliers/supplier-interfaces";
import { debounce } from "lodash";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

interface SupplierContextValue {
    sortKey: keyof SupplierTableRow | "specialOrderCount";
    setSortKey: (key: keyof SupplierTableRow) => void

    sortDir: string
    setSortDir: (dir: SortDir) => void

    isActive: boolean | undefined
    setIsActive: (val: boolean | undefined) => void

    search: string | undefined
    setSearch: (val: string | undefined) => void

    orderedById: string | undefined
    setOrderedById: (val: string | undefined) => void

    page: number
    setPage: (page: number) => void

    totalPages: number
    suppliers: SupplierTableRow[]
    totalSuppliers: number
    loading: boolean

    reset: () => void
    refresh: () => void
    nextPage: () => void
    prevPage: () => void
}

const SupplierTableContextInternal = createContext<SupplierContextValue | undefined>(undefined);
const defaultSortKey = "name"
const defaultSortDir = "asc"
const defaultPage = 1
const defaultPageSize = 25
const defSearch: string | undefined = undefined

export function SupplierTableContext({
    children,
    suppliers: initialSuppliers,
    supplierCount: initialSupplierCount
}: {
    children: ReactNode,
    suppliers: SupplierTableRow[],
    supplierCount: number
}) {
    const [loading, setLoading] = useState<boolean>(false);
    const [sortKey, setSortKey] = useState<keyof SupplierTableRow | "specialOrderCount">(defaultSortKey);
    const [sortDir, setSortDir] = useState<SortDir>(defaultSortDir);
    const [page, setPage] = useState<number>(defaultPage);
    const [totalSuppliers, setTotalSuppliers] = useState<number>(initialSupplierCount);
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [orderedById, setOrderedById] = useState<string | undefined>(undefined);
    const [suppliers, setSuppliers] = useState<SupplierTableRow[]>(initialSuppliers);
    const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

    const isInitialMount = useRef(true);

    const totalPages = Math.ceil(totalSuppliers / defaultPageSize);

    const sort: SupplierQuery["sort"] = sortKey === "specialOrderCount" ? "specialOrderCount" : "name"

    const query = useMemo(() => ({
        sort,
        dir: sortDir,
        page,
        orderedById,
        isActive,
        search,
        limit: 25
    }), [sort, sortDir, page, orderedById, search, isActive])

    const debouncedFetch = useMemo(() => debounce( async (q: SupplierQuery) => {
        try {
            const res = await getSupplierData(q);
            setSuppliers(res.data);
            setTotalSuppliers(res.total);
        } catch (error) {
            console.error("Error Fetching Suppliers", error)
        } finally {
            setLoading(false)
        }
    }, 300), []);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return
        }
        setLoading(true);
        debouncedFetch(query);
    }, [query, debouncedFetch])

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

    const handleSetSearch = useCallback((newSearch: string | undefined) => {
        setSearch(newSearch);
        setPage(defaultPage)
    }, [])

    const handleIsActive = useCallback((act: boolean | undefined) => {
        setIsActive(act);
    }, [])

    const handleSetOrderedById = useCallback((id: string | undefined) => {
        setOrderedById(id)
        setPage(defaultPage)
    }, []);

    const handleRest = useCallback(() => {
        setSortKey(defaultSortKey);
        setSortDir(defaultSortDir);
        setPage(defaultPage);
        setSearch(defSearch)
    }, [])

    const handleRefresh = useCallback(async () => {
        setLoading(true);
        debouncedFetch.cancel();

        try {
            const res = await getSupplierData(query)
            setSuppliers(res.data);
            setTotalSuppliers(res.total);
        } catch (error) {
            console.error("Failed to fetch brands", error)
        } finally {
            setLoading(false)
        }
    }, [query]);

    const val: SupplierContextValue = {
        sortKey,
        sortDir,
        search,
        isActive,
        page,
        suppliers,
        totalSuppliers,
        loading,
        orderedById,
        setOrderedById: handleSetOrderedById,
        setSortKey,
        setSortDir,
        setIsActive: handleIsActive,
        setSearch: handleSetSearch,
        setPage: handleSetPage,
        nextPage: handleNextPage,
        prevPage: handlePrevPage,
        refresh: handleRefresh,
        reset: handleRest,
        totalPages
    };
    
    return (
        <SupplierTableContextInternal.Provider value={val}>
            {children}
        </SupplierTableContextInternal.Provider>
    )
}

export function useSupplierTableContext() {
    const context = useContext(SupplierTableContextInternal)
    if (context === undefined) {
        throw new Error("useSupplierContext must be used inside Supplier table contex")
    }
    return context
}
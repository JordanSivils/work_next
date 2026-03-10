"use client"
import { BrandQuery, BrandTableRow } from "@/lib/actions/brands/brand-interface";
import { getBrandData, SortDir } from "@/lib/actions/brands/get-brand-data";
import { debounce } from "lodash";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

interface BrandTableContextValue {
    sortKey: keyof BrandTableRow;
    setSortKey: (key: keyof BrandTableRow) => void

    sortDir: SortDir;
    setSortDir: (dir: SortDir) => void

    isActive: boolean | undefined
    setIsActive: (key: boolean | undefined) => void

    search: string | undefined
    setSearch: (search?: string | undefined) => void

    inventoriedById: string | undefined
    setInventoriedById: (id: string | undefined) => void

    page: number
    setPage: (page: number) => void

    totalPages: number
    brands: BrandTableRow[]
    totalBrands: number
    loading: boolean
    
    reset: () => void
    refresh: () => void
    nextPage: () => void
    prevPage: () => void
}

const BrandTableContextInternal = createContext<BrandTableContextValue | undefined>(undefined);
const defaultSortKey = "name"
const defaultSortDir = "asc"
const defaultPage = 1
const defaultPageSize = 25
const DEFAULT_SEARCH: string | undefined = undefined

export function BrandTableContext({ 
    children, 
    brands: initialBrands, 
    brandCount: initialBrandCount
 }: {
    children: ReactNode,
    brands: BrandTableRow[]
    brandCount: number
}) {
    const [loading, setLoading] = useState<boolean>(false);
    const [sortKey, setSortKey] = useState<keyof BrandTableRow>(defaultSortKey);
    const [sortDir, setSortDir] = useState<SortDir>(defaultSortDir);
    const [page, setPage] = useState<number>(defaultPage);
    const [inventoriedById, setInventoriedById] = useState<string | undefined>(undefined)
    const [search, setSearch] = useState<string | undefined>(DEFAULT_SEARCH)
    const [brands, setBrands] = useState<BrandTableRow[]>(initialBrands)
    const [totalBrands, setTotalBrands] = useState<number>(initialBrandCount)
    const [isActive, setIsActive] = useState<boolean | undefined>(undefined)

    const isInitialMount = useRef(true);

    const totalPages = Math.ceil(totalBrands / defaultPageSize)

    const sort: BrandQuery["sort"] = sortKey === "lastInventoriedAt" ? "lastInventoriedAt" : "name"
    const query = useMemo<BrandQuery>(() => ({
        sort,
        dir: sortDir,
        page: page,
        inventoriedById,
        isActive,
        search,
        limit: 25,
    }), [sort, sortDir, page, inventoriedById, search, isActive])

    const debouncedFetch = useMemo(() => debounce( async (q: BrandQuery) => {
        try {
            const res = await getBrandData(q)
            setBrands(res.data);
            setTotalBrands(res.total)
        } catch (error) {
            console.error("error fetching brands", error)
        } finally {
            setLoading(false)
        }
    }, 300), [])

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
    const handleSetInventoriedById = useCallback((id: string | undefined) => {
        setInventoriedById(id)
        setPage(defaultPage)
    }, [])

    const handleIsActive = useCallback((act: boolean | undefined) => {
        setIsActive(act);
    }, [])

    const handleRest = useCallback(() => {
        setSortKey(defaultSortKey);
        setSortDir(defaultSortDir);
        setPage(defaultPage);
        setSearch(DEFAULT_SEARCH)
    }, [])

    const handleRefresh = useCallback(async () => {
        setLoading(true);
        debouncedFetch.cancel();

        try {
            const res = await getBrandData(query)
            setBrands(res.data);
            setTotalBrands(res.total);
        } catch (error) {
            console.error("Failed to fetch brands", error)
        } finally {
            setLoading(false)
        }
    }, [query]);

    const val: BrandTableContextValue = {
        sortKey,
        sortDir,
        search,
        isActive,
        page,
        brands,
        totalBrands,
        loading,
        inventoriedById,
        setInventoriedById: handleSetInventoriedById,
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
        <BrandTableContextInternal.Provider value={val}>
            {children}
        </BrandTableContextInternal.Provider>
    )
}

export function useBrandTableContext() {
    const context = useContext(BrandTableContextInternal)
    if (context === undefined) {
        throw new Error("use brand table context must be used inside brand table context")
    }
    return context
}
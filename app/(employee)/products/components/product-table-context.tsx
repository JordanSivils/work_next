"use client"
import { SortDir } from "@/lib/actions/brands/get-brand-data";
import { getAllProducts } from "@/lib/actions/products/get-product-data";
import { ProductQuery, ProductTableRow } from "@/lib/actions/products/product-interfaces";
import { debounce } from "lodash";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

interface ProductContextValue {
    sortKey: keyof ProductTableRow
    setSortKey: (key: keyof ProductTableRow) => void

    sortDir: SortDir;
    setSortDir: (dir: SortDir) => void

    supplierId: string | undefined
    setSupplierId: (id: string | undefined) => void

    brandId: string | undefined
    setBrandId: (id: string | undefined) => void

    categoryId: string | undefined
    setCategoryId: (id: string | undefined) => void
    
    search: string | undefined
    setSearch: (search?: string | undefined) => void

    page: number
    setPage: (val: number) => void

    totalPages: number
    products: ProductTableRow[]
    totalProducts: number
    loading: boolean

    reset: () => void
    refresh: () => void
    nextPage: () => void
    prevPage: () => void
} 

const ProductContextInternal = createContext<ProductContextValue | undefined>(undefined)
const defaultSortKey = "description"
const defaultSortDir = "asc"
const defaultPage = 1
const defaultPageSize = 25
const defaultSearch: string | undefined = undefined

export function ProductTableContext({
    children,
    products: initialProducts,
    productCount: initialProductCount
}: {
    children: ReactNode,
    products: ProductTableRow[],
    productCount: number
}) {
    const [loading, setLoading] = useState<boolean>(false);
    const [sortKey, setSortKey] = useState<keyof ProductTableRow>(defaultSortKey);
    const [sortDir, setSortDir] = useState<SortDir>(defaultSortDir);
    const [page, setPage] = useState<number>(defaultPage);
    const [totalProducts, setTotalProducts] = useState<number>(initialProductCount);
    const [products, setProducts] = useState<ProductTableRow[]>(initialProducts);
    const [search, setSearch] = useState<string | undefined>(defaultSearch)
    const [supplierId, setSupplierId] = useState<string | undefined>(undefined);
    const [brandId, setBrandId] = useState<string | undefined>(undefined);
    const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
    const [limit] = useState(defaultPageSize)

    const isInitialMount = useRef(true);

    const totalPages = Math.ceil(totalProducts / limit);

    const sort: ProductQuery["sortKey"] = sortKey === "description" ? "description" : sortKey;
    const query = useMemo<ProductQuery>(() => ({
        sortKey: sort,
        sortDir,
        search,
        page,
        brandId,
        supplierId,
        categoryId,
        limit
    }), [sort, sortDir, page, search, supplierId, categoryId, brandId, limit])

    const debouncedFetch = useMemo(() => debounce(async (q: ProductQuery) => {
        try {
            const res = await getAllProducts(q);
            setProducts(res.data);
            setTotalProducts(res.total);
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

    const handleSetSearch = useCallback((newSearch: string | undefined) => {
        setSearch(newSearch);
        setPage(defaultPage)
    }, [])

    const handleSetCategoryId = useCallback((id: string | undefined) => {
        setCategoryId(id);
        setPage(defaultPage)
    }, [])

    const handleSetSupplierId = useCallback((id: string | undefined) => {
        setSupplierId(id);
        setPage(defaultPage)
    }, [])

    const handleSetBrandId = useCallback((id: string | undefined) => {
        setBrandId(id);
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
            const res = await getAllProducts(query)
            setProducts(res.data);
            setTotalProducts(res.total);
        } catch (error) {
            console.error("Failed to fetch brands", error)
        } finally {
            setLoading(false)
        }
    }, [query]);

    const val: ProductContextValue = {
        sortDir,
        sortKey,
        page,
        products,
        totalProducts,
        loading,
        search,
        supplierId,
        brandId,
        categoryId,
        setSearch: handleSetSearch,
        setSortDir,
        setSortKey,
        setSupplierId: handleSetSupplierId,
        setBrandId: handleSetBrandId,
        setCategoryId: handleSetCategoryId,
        setPage: handleSetPage,
        nextPage: handleNextPage,
        prevPage: handlePrevPage,
        refresh: handleRefresh,
        reset: handleRest,
        totalPages
    };

    return (
        <ProductContextInternal.Provider value={val}>
            {children}
        </ProductContextInternal.Provider>
    )
};

export function useProductContext() {
    const context = useContext(ProductContextInternal)
    if (context === undefined) throw new Error("useTable must be used inside of specialOrderTableContext")
    return context
}
import { ProductTableWrapper } from './fetch-page';
import { Suspense } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

function ProductTableSkeleton() {
  // Based on Product type: description, available, status, price (and sometimes category)
  const columns = 5;
  const rows = 15;

  return (
    <>
      <div className="flex justify-between px-4 items-end gap-4">
      <div className="flex flex-col">
        <Skeleton className="h-10 w-56" />  
      </div>

      {/* Search input */}
      <Skeleton className="h-10 w-80" />

      {/* Pagination */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
    <Table>
      <TableCaption>Products</TableCaption>
      <TableHeader>
        <TableRow>
          {Array.from({ length: columns }).map((_, i) => (
            <TableHead key={i}>
              <Skeleton className="h-4 w-20" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
    
  );
}

export async function ProductPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams;
  // const q = searchParams.q
  // const page = searchParams.page
  const {
    page,
    limit,
    brand,
    suppliers,
    category,
    search,
  } = await searchParams
  
  const status = params.status === "negative" || params.status === "standard" ? params.status : undefined
  const sort = params.sort === "available" || params.sort === "description" ? params.sort : undefined
  const dir = params.dir === "asc" || params.dir === "desc" ? params.dir : undefined
  
  return (
    <div>
      <h1 className='text-xl font-semibold'>Products</h1>
        
      <Suspense fallback={<ProductTableSkeleton />}>
        <ProductTableWrapper 
        query={{ 
          page,
          limit,
          brand,
          suppliers,
          category,
          search,
          status,
          sort,
          dir
        }} 
        />
      </Suspense>
    </div>
  );
}

export default ProductPage;

{/* 
        <uiContainerForFilters>
            < Fetch Here >
          <Suspense>


            <filterWrapper>
              <triggerForSheet stuffFromDb={ }>
                <uiForSheet>
                  <comboBoxToPickFilter></comboBoxToPickFilter>
                  <comboBoxToPickFilter></comboBoxToPickFilter>
                  <comboBoxToPickFilter></comboBoxToPickFilter>
                </uiForSheet>
              </triggerForSheet>
            </filterWrapper>
          </Suspense>
        </uiContainerForFilters>
        */}
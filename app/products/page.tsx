import { Button } from '@/components/ui/button';
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
import { ProductFilter } from './components/product-filter';
import { ItemStatus } from '../generated/prisma/enums';

function ProductTableSkeleton() {
  // Based on Product type: description, available, status, price (and sometimes category)
  const columns = 5;
  const rows = 5;

  return (
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
  const dir = params.dir === "desc" || params.dir === "asc" ? params.dir : undefined
  
  
  return (
    <div>
      <h1 className='text-xl font-semibold'>Products</h1>
      <div className='p-4 bg-card w-full rounded-md'>
        <ProductFilter />

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
      </div>
      <Suspense fallback={<ProductTableSkeleton />}>
        <ProductTableWrapper query={{ page, limit, status, brand, search, sort, dir, suppliers, category}} />
      </Suspense>
    </div>
  );
}

export default ProductPage;

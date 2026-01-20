import { TableSkeleton } from '@/components/ui/table-skeleton';
import { ProductTableWrapper } from './fetch-page';
import { Suspense } from 'react';

export async function ProductPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams;
  const {
    page,
    limit,
    brand,
    supplier,
    category,
    search,
  } = await searchParams
  
  const status = params.status === "negative" || params.status === "standard" ? params.status : undefined
  const sort = params.sort === "available" || params.sort === "description" ? params.sort : undefined
  const dir = params.dir === "asc" || params.dir === "desc" ? params.dir : undefined
  
  return (
    <div>
      <h1 className='text-xl font-semibold'>Products</h1>
        
      <Suspense fallback={<TableSkeleton />}>
        <ProductTableWrapper 
        productQuery={{ 
          page,
          limit,
          brand,
          supplier,
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


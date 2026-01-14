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

export function ProductPage() {
  return (
    <div>
      <h1 className='text-xl font-semibold'>Products</h1>
      <div className='p-4 bg-card w-full rounded-md'>
        <Button>Filter by something</Button>
      </div>
      <Suspense fallback={<ProductTableSkeleton />}>
        <ProductTableWrapper />
      </Suspense>
    </div>
  );
}

export default ProductPage;

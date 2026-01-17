"use client"
import { Product } from '@/lib/actions/products/product-interfaces';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import Link from 'next/link';

interface ProductTableProps {
  products: Product[];
}


export function ProductTable({ products }: ProductTableProps) {
  return (
    <Table>
      <TableCaption>Products</TableCaption>
      <TableHeader>
        <TableRow>
          {products.length > 0 &&
          Object.keys(products[0])
            .filter((key) => key !== "id")
            .map((key) => (
              <TableHead key={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </TableHead>
            ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          

          <TableRow key={product.description} className='cursor-pointer' >
            
            {Object.entries(product)
              .filter(([key]) => key !== "id")
              .map(([key, value]) => (
                <TableCell key={key}><Link href={`/products/${product.id}`}>{value}</Link></TableCell>
              ))}
          </TableRow>
          
            
        ))}
      </TableBody>
    </Table>
  );
}



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
import { ProductDialog } from './product-dialog';

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
            <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
            <TableRow key={product.description}>
            {Object.entries(product)
              .filter(([key]) => key !== "id")
              .map(([key, value]) => (
                <TableCell key={key}>{value}</TableCell>
              ))}
            <TableCell><ProductDialog id={product.id} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


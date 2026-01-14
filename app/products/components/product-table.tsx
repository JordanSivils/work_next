import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Product } from '@/lib/actions/get-product-data';

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
            Object.keys(products[0]).map((key) => (
              <TableHead key={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </TableHead>
            ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.description}>
            {Object.values(product).map((item) => (
              <TableCell>{item ?? 'N/A'}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


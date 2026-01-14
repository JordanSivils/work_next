import { ProductTable } from '@/app/products/components/product-table';
import { getProducts } from '@/lib/actions/get-product-data';

export async function ProductTableWrapper() {
  const products = await getProducts();

  return <ProductTable products={products} />;
}

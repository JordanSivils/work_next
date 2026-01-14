import { ProductTable } from '@/app/products/components/product-table';
import { getItems, Product, ProductQuery } from '@/lib/actions/get-product-data';

interface TableWrapperProps {
  query: ProductQuery
}
export async function ProductTableWrapper({ query }: TableWrapperProps) {
  const data = await getItems(query);

  const products = data.map((product): Product => ({
      id: product.id,
      description: product.description,
      available: Number(product.available),
      status: product.status,
      category: product.Category?.name ?? "NA"
    }))

  return <ProductTable products={products} />;
}

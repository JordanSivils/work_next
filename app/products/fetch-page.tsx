import { ProductTable } from '@/app/products/components/product-table';
import { BrandCombobox } from '@/components/ui/brand-combobox';
import { getBrandData } from '@/lib/actions/brands/get-brand-data';
import { getAllProducts } from '@/lib/actions/products/get-product-data';
import { Product, ProductQuery } from '@/lib/actions/products/product-interfaces';

interface TableWrapperProps {
  query: ProductQuery
}
export async function ProductTableWrapper({ query }: TableWrapperProps) {
  const res = await getAllProducts(query);

  const products = res.data.map((product): Product => ({
      id: product.id,
      description: product.description,
      available: Number(product.available),
      status: product.status,
      category: product.Category?.name ?? "NA"
    }))

  return <ProductTable products={products} />;
}

export async function BrandComboboxWrapper() {
  const res = await getBrandData();

  return <BrandCombobox brands={res} />
}

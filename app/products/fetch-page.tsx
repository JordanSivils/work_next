import { ProductTable } from '@/app/products/components/product-table';
import { BrandCombobox } from '@/components/ui/brand-combobox';
import { getBrandData } from '@/lib/actions/brands/get-brand-data';
import { getAllProducts } from '@/lib/actions/products/get-product-data';
import { Product, ProductQuery, ProductResponse } from '@/lib/actions/products/product-interfaces';
import { FilterPaginationWrapper } from './components/filter-pagination';

interface TableWrapperProps {
  query: ProductQuery
}
  export async function ProductTableWrapper({  query }: TableWrapperProps) {

  const asyncTimeout = () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 4000)
    })
  }
  await asyncTimeout();
  const brands = await getBrandData()
  const products = await getAllProducts(query)

  const mapedProducts = products.data.map((product): Product => ({
      id: product.id,
      description: product.description,
      available: Number(product.available),
      status: product.status,
      category: product.Category?.name ?? "NA"
    }))
    const nextPage = products.nextPage
    const previousPage = products.previousPage
    const totalPages = products.pageCount
    const currentPage = products.page
  return (
  <>
  <FilterPaginationWrapper pagination={{ nextPage, previousPage, totalPages, currentPage }} brands={brands} />
  <ProductTable products={mapedProducts} />
  </>
  );
}
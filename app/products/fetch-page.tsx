import { ProductTable } from '@/app/products/components/product-table';
import { getBrandData } from '@/lib/actions/brands/get-brand-data';
import { getAllProducts } from '@/lib/actions/products/get-product-data';
import { Product, ProductQuery } from '@/lib/actions/products/product-interfaces';
import { FilterPaginationWrapper } from './components/filter-pagination';
import { getSupplierData } from '@/lib/actions/suppliers/get-supplier-data';
import { ProductDataTable } from './components/product-data-table';
import { columns } from './components/column-defs';

interface TableWrapperProps {
  query: ProductQuery
}
  export async function ProductTableWrapper({ query }: TableWrapperProps) {

  // const asyncTimeout = () => {
  //   return new Promise((resolve) => {
  //     setTimeout(resolve, 4000)
  //   })
  // }
  // await asyncTimeout();
  const suppliers = await getSupplierData()
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
  <FilterPaginationWrapper pagination={{ nextPage, previousPage, totalPages, currentPage }} brands={brands} suppliers={suppliers} />
  {/* <ProductTable products={mapedProducts} /> */}
  <ProductDataTable columns={columns} data={mapedProducts} />
  </>
  );
}
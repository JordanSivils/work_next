import { getBrandData } from '@/lib/actions/brands/get-brand-data';
import { getAllProducts } from '@/lib/actions/products/get-product-data';
import { Product, ProductQuery } from '@/lib/actions/products/product-interfaces';
import { FilterPaginationWrapper } from './components/product-filter-pagination';
import { getSupplierData } from '@/lib/actions/suppliers/get-supplier-data';
import { ProductDataTable } from './components/product-data-table';
import { columns } from './components/column-defs';
import { BrandComboboxInterface } from '@/lib/actions/brands/brand-interface';

interface TableWrapperProps {
  productQuery: ProductQuery
}
  export async function ProductTableWrapper({ productQuery }: TableWrapperProps) {

  const asyncTimeout = () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 4000)
    })
  }
  await asyncTimeout();
  const suppliers = await getSupplierData()
  const brands = await getBrandData()
  const products = await getAllProducts(productQuery)

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

    const mappedBrand = brands.data.map((brand): BrandComboboxInterface => ({
      id: brand.id,
      name: brand.name
    }))
    
  return (
  <>
  <FilterPaginationWrapper pagination={{ nextPage, previousPage, totalPages, currentPage }} brands={mappedBrand} suppliers={suppliers} />
  <ProductDataTable columns={columns} data={mapedProducts} />
  </>
  );
}
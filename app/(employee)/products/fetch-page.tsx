import { getBrandData } from '@/lib/actions/brands/get-brand-data';
import { getAllProducts } from '@/lib/actions/products/get-product-data';
import { Product, ProductQuery, ProductTable } from '@/lib/actions/products/product-interfaces';
import { FilterPaginationWrapper } from './components/product-filter-pagination';
import { getSupplierData } from '@/lib/actions/suppliers/get-supplier-data';
import { ProductDataTable } from './components/product-data-table';
import { columns } from './components/column-defs';
import { BrandComboboxInterface } from '@/lib/actions/brands/brand-interface';
import { getAllUsers } from '@/lib/actions/users/get-users';
import { Supplier } from '@/lib/actions/suppliers/supplier-interfaces';

interface TableWrapperProps {
  productQuery: ProductQuery
}
  export async function ProductTableWrapper({ productQuery }: TableWrapperProps) {
  //    const asyncTimeout = () => {
  //   return new Promise((resolve) => {
  //     setTimeout(resolve, 3000)
  //   })
  // }
  // await asyncTimeout();
  const suppliers = await getSupplierData()
  const users = await getAllUsers()
  const brands = await getBrandData()
  const products = await getAllProducts(productQuery)

  const mapedProducts = products.result.data.map((product): ProductTable => ({
      id: product.id,
      description: product.description,
      available: Number(product.available),
      category: product.Category?.name ?? "NA"
    }))
    const nextPage = products.result.nextPage
    const previousPage = products.result.previousPage
    const totalPages = products.result.pageCount
    const currentPage = products.result.page

    const mappedBrand = brands.data.map((brand): BrandComboboxInterface => ({
      id: brand.id,
      name: brand.name
    }))

    const mappedSupplier = suppliers.data.map((sup): Supplier => ({
        id: sup.id,
        name: sup.name,
    }))
    
  return (
    <div className='flex flex-col gap-4 m-4'>
      <FilterPaginationWrapper pagination={{ nextPage, previousPage, totalPages, currentPage }} users={users} brands={mappedBrand} suppliers={mappedSupplier} />
      <ProductDataTable columns={columns} data={mapedProducts} />
    </div>
  );
}
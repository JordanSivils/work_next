import { getBrandData } from '@/lib/actions/brands/get-brand-data';
import { getAllProducts } from '@/lib/actions/products/get-product-data';
import { ProductQuery } from '@/lib/actions/products/product-interfaces';
import { getSupplierData } from '@/lib/actions/suppliers/get-supplier-data';
import { ProductDataTable } from './components/product-data-table';
import { BrandComboboxInterface } from '@/lib/actions/brands/brand-interface';
import { Supplier } from '@/lib/actions/suppliers/supplier-interfaces';
import { GeneralWrapper } from '@/components/ui/page-wrapper';
import { ProductTableContext } from './components/product-table-context';
import { ProductTableTopper } from './components/product-filter-pagination';
import { getAllCategories } from '@/lib/actions/categories/get-category-data';

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
  const categories = await getAllCategories()
  const brands = await getBrandData()
  const products = await getAllProducts({page: 1, limit: 25})

    const mappedBrand = brands.data.map((brand): BrandComboboxInterface => ({
      id: brand.id,
      name: brand.name
    }))

    const mappedSupplier = suppliers.data.map((sup): Supplier => ({
        id: sup.id,
        name: sup.name,
    }))
    
  return (
    <GeneralWrapper>
      <ProductTableContext products={products.data} productCount={products.total}>
          <ProductTableTopper brands={mappedBrand} suppliers={mappedSupplier} categories={categories}/>
          <ProductDataTable />
      </ProductTableContext>
    </GeneralWrapper>
  );
}
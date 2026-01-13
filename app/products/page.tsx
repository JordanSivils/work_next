import TableGeneric from "@/components/table/Table"
import { Item } from "@/models/Item"

const ProductPage = async () => {
    const items = await Item.findAll({
        limit: 10
    })
    const un = items as unknown
    const data = un as Product[]
    return (
        <>
            <TableGeneric 
            tableData={data} 
            tableCols={["description", "available", "categoryId"]}
            caption="Producs" 
            />
        </>
    )
}

export default ProductPage
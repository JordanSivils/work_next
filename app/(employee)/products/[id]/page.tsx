interface ProductPageProps {
    params: {
        id: string
    }
}
export default async function ProductPage({ params }: ProductPageProps) {
    const param = await params
    const { id } = param
    return ( 
        <h1>{id}</h1>
    )
}

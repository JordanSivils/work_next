import { Suspense } from "react";
import { SupplierTableWrapper } from "./fetch-page";

export default async function BrandPage(){
    return (
        <div className="">
            <h1>Suppliers</h1>

            <Suspense fallback={<div>Loading ... </div>}>
                <SupplierTableWrapper />
            </Suspense>
        </div>
    )
}
import { Suspense } from "react";
import { BrandTableWrapper } from "./fetch-page";

export default async function BrandPage(){
    return (
        <div className="space-y-4">
            <h1>Brands</h1>
            <Suspense fallback={<div>Loading ... </div>}>
                <BrandTableWrapper />
            </Suspense>
        </div>
    )
}
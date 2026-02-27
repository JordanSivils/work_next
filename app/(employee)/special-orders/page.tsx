import { GeneralWrapper } from "@/components/ui/page-wrapper";
import { Suspense } from "react";
import { SpecialOrderTableWrapper } from "./fetch-page";

export default function SpecialOrderPage() {
    return (
        <GeneralWrapper>
            <h1>Special Orders</h1>
            <Suspense fallback={<p>Loading</p>}>
                <SpecialOrderTableWrapper />
            </Suspense>
        </GeneralWrapper>
    )
}
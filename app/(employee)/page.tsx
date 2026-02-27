import { Suspense } from "react";
import { GeneralWrapper } from "@/components/ui/page-wrapper";
import { HomePageFetch } from "./home-page-fetch";

export default function HomePage() {
    return (
        <GeneralWrapper>
            <HomePageFetch />
        </GeneralWrapper>
    )
}
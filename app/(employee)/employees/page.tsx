import { Suspense } from "react";
import { EmployeeTableWrapper } from "./fetch-page";

export default function EmployeePage() {
    return (
        <>
        <Suspense fallback={"loading ..."}>
            <EmployeeTableWrapper />
        </Suspense>
        </>
    )
}
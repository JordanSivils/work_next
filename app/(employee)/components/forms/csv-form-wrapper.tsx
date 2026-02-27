import { DatabaseZap } from "lucide-react";
import { SidebarDialogWrapper } from "./dialog-wrapper-home";
import { CsvForm } from "./csv-form";

export function CsvFormWrapper() {
    return (
        <SidebarDialogWrapper
        btnLabel={
            <><DatabaseZap />Database Csv</>
        }
        dialogTitle="Upload Full Inventory CSV"
        dialogDescription="Be Sure it's a CSV and not excel"
        >
            <CsvForm />
        </SidebarDialogWrapper>
    )
}
import { ReactNode } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

type StringKeys<T> = Extract<keyof T, string>

type DynamicTableProps<T> = {
    tableData: T[]
    tableCols: StringKeys<T>[]
    excludeCols?: StringKeys<T>[]
    caption: string
    customBody?: (
        rowData: T,
        col: StringKeys<T>
    ) => ReactNode | null | undefined;
}

const TableGeneric = <T extends object>(
    props: DynamicTableProps<T>
) => {
    const {
        tableCols,
        tableData,
        excludeCols = [],
        customBody
    } = props

    function shouldRender(key: StringKeys<T>) {
        if (excludeCols.includes(key)) return false;
        return true;
    }

    const whatToRenderBody = (row: T, col: StringKeys<T>) => {
        if (!shouldRender(col)) return null;
        const renderedContent = customBody ? customBody(row, col) : null
        return renderedContent || (row[col] as ReactNode);
    }

    return (
        <Table>
            <TableCaption>{props.caption}</TableCaption>
            <TableHeader>
                <TableRow>
                    {tableCols.map((col, i) => (
                        <TableHead key={i}>{col}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {tableData.map((row, i) => (
                <TableRow key={i}>
                    {tableCols.map((col, o) => (
                        <TableCell key={o}>{whatToRenderBody(row, col)}</TableCell>
                    ))}
                </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default TableGeneric
import * as xl from "xlsx"

interface RawData {
    Available: number
    Description: string
}

export interface PdfData {
    description: string
    available: number
}

export async function parseExcel(file: File) {
    const buffer = await file.arrayBuffer()
    const data = new Uint8Array(buffer)

    const workbook = xl.read(data, { type: "array" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    const json: RawData[] = xl.utils.sheet_to_json(worksheet, { defval: "" })
    const mappedJson = json.map((val): PdfData => ({
        description: val.Description,
        available: val.Available
    }))

  return mappedJson
}
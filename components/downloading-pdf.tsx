import { PdfData } from "@/lib/parse-excel";
import { Document, Page, pdf, StyleSheet, Text, View } from "@react-pdf/renderer";

export type InventoryPdfProps = {
    rows: PdfData[]
    brand: string 
}

const styles = StyleSheet.create({
    page: { padding: 18, backgroundColor: "#fff" },

  headingBlock: { marginBottom: 12 },
  h1: { fontSize: 18, marginBottom: 6 },
  metaRow: { flexDirection: "row", gap: 12, fontSize: 10, color: "#444" },

  table: { display: "flex", width: "100%", borderWidth: 1, borderColor: "#000", borderRadius: 2 },
  row: { flexDirection: "row" },

  // base cell
  cell: { padding: 6, fontSize: 10, borderRightWidth: 1, borderRightColor: "#000" },
  // remove last border on row end
  cellLast: { borderRightWidth: 0 },

  // header
  head: { backgroundColor: "white", fontWeight: 700, borderBottomWidth: 1, borderBottomColor: "#000" },

  // zebra striping for body
  zebra: { backgroundColor: "#fafafa" },

  // column widths via flex ratios
  colDesc: { flex: 3, minWidth: 100, borderBottom: "1px" },
  colDescHead: { flex: 3, minWidth: 100 },
  // colAvail: { flex: 1, alignItems: "flex-end", textAlign: "right" },
  colCount: { flex: 1, alignItems: "flex-end", textAlign: "right", borderBottom: "1px" },
  colPickup: { flex: 2, alignItems: "flex-end", textAlign: "right", borderBottom: "1px" },
  colCountHead: { flex: 1, alignItems: "flex-end", textAlign: "right" },
  colPickupHead: { flex: 2, alignItems: "flex-end", textAlign: "right" },
});

const InventoryPdf = ({ rows, brand }: InventoryPdfProps) => {
    let timeStamp = Date.now();
    let readableDate = new Date(timeStamp).toLocaleString();

    return (
        <Document>
        <Page size="A4" style={styles.page}>
            {/* Header / meta */}
            <View style={styles.headingBlock}>
            <Text style={styles.h1}>Inventory</Text>
            <View style={styles.metaRow}>
                <Text>Brand:{brand}</Text>
                <Text>Printed At: {readableDate}</Text>
                <Text>Iventoried By: _______________</Text>
            </View>
            </View>

            {/* Table */}
            <View style={styles.table}>
            {/* Head */}
            <View style={[styles.row, styles.head]} fixed>
                <Text style={[styles.cell, styles.colDescHead]}>Description</Text>
                <Text style={[styles.cell, styles.colCountHead]}>Available</Text>
                <Text style={[styles.cell, styles.colCountHead]}>In Warehouse</Text>
                <Text style={[styles.cell, styles.colCountHead]}>Sold Since Printed</Text>
                <Text style={[styles.cell, styles.colPickupHead]}>Delivery/Pick-up</Text>
                <Text style={[styles.cell, styles.colCountHead, styles.cellLast]}>+/-</Text>
            </View>

            {/* Body */}
            {rows.map((row) => (
                <View key={row.description} style={styles.row}>
                <Text style={[styles.cell, styles.colDesc]}>{row.description}</Text>
                <Text style={[styles.cell, styles.colCount]}>{row.available}</Text>
                <Text style={[styles.cell, styles.colCount]}>{"" /* user-fillable */}</Text>
                <Text style={[styles.cell, styles.colCount]}>{"" /* user-fillable */}</Text>
                <Text style={[styles.cell, styles.colPickup]}>{"" /* user-fillable */}</Text>
                <Text style={[styles.cell, styles.colCount, styles.cellLast]}>{""}</Text>
                
                </View>
            ))}
            </View>
        </Page>
        </Document>
    )
}

function downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = fileName
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url) 
}

export async function downloadPdf(rows: PdfData[], brand: string) {
    const blob = await pdf(<InventoryPdf brand={brand} rows={rows} />).toBlob()
    downloadBlob(blob, `${brand}-Inventory.pdf`)
}
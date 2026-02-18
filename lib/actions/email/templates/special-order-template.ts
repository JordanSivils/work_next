import { SpecialOrderEmail } from "../../special-order/special-order-interfaces";

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderItemsTable(items: SpecialOrderEmail["items"]) {
  if (!items || items.length === 0) {
    return `
      <tr>
        <td style="padding: 12px 0; color:#666;">No items listed.</td>
      </tr>
    `;
  }

  const rows = items
    .map((it) => {
      const name = escapeHtml(it.name);
      const qty = escapeHtml(it.quantity);
      const weight = it.weight ? escapeHtml(it.weight) : "";

      return `
        <tr>
          <td style="padding: 10px 8px; border-bottom: 1px solid #eee;">${name}</td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #eee; text-align:right;">${qty}</td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #eee; text-align:right;">${weight}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <tr>
      <td colspan="3" style="padding: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; width:100%;">
          <thead>
            <tr>
              <th style="padding: 10px 8px; border-bottom: 1px solid #ddd; text-align:left; font-weight:600;">Item</th>
              <th style="padding: 10px 8px; border-bottom: 1px solid #ddd; text-align:right; font-weight:600;">Qty</th>
              <th style="padding: 10px 8px; border-bottom: 1px solid #ddd; text-align:right; font-weight:600;">Weight</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </td>
    </tr>
  `;
}

export function renderSpecialOrderEmailHtml(order: SpecialOrderEmail) {
  const supplier = order.supplierName ? escapeHtml(order.supplierName) : "—";
  const customer = order.customer ? escapeHtml(order.customer) : "—";
  const customerContact = order.customerContact ? escapeHtml(order.customerContact) : "—";
  const notes = order.notes ? escapeHtml(order.notes) : "";
  const createdBy = escapeHtml(order.createdBy);
  const status = order.orderStatus ? escapeHtml(order.orderStatus) : "—";
  const recurring = order.recurring ? "Yes" : "No";
  const existingItem = order.existingItem ? "Yes" : "No";
  const createAt = escapeHtml(order.createAt.toLocaleDateString())

  return `
<!doctype html>
<html>
  <body style="margin:0; padding:0; background:#f6f7f9; font-family: Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f9; padding: 24px 0;">
      <tr>
        <td align="center">
          <table width="640" cellpadding="0" cellspacing="0" style="background:#ffffff; border:1px solid #e9eaee; border-radius: 12px; overflow:hidden;">
            <tr>
              <td style="padding: 18px 20px; background:#111827; color:#fff;">
                <div style="font-size: 16px; font-weight: 700;">Special Order</div>
                <div style="font-size: 12px; opacity: 0.85;">Date: ${createAt}</div>
              </td>
            </tr>

            <tr>
              <td style="padding: 18px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color:#6b7280; width: 180px;">Supplier</td>
                    <td style="padding: 8px 0; font-weight: 600;">${supplier}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color:#6b7280;">Customer</td>
                    <td style="padding: 8px 0; font-weight: 600;">${customer}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color:#6b7280;">Customer Contact</td>
                    <td style="padding: 8px 0; font-weight: 600;">${customer}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color:#6b7280;">Status</td>
                    <td style="padding: 8px 0; font-weight: 600;">${status}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color:#6b7280;">Recurring</td>
                    <td style="padding: 8px 0; font-weight: 600;">${recurring}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color:#6b7280;">Existing Item</td>
                    <td style="padding: 8px 0; font-weight: 600;">${existingItem}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color:#6b7280;">Created By</td>
                    <td style="padding: 8px 0; font-weight: 600;">${createdBy}</td>
                  </tr>
                </table>

                <div style="margin: 18px 0 10px; font-size: 14px; font-weight: 700;">Items</div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                  ${renderItemsTable(order.items)}
                </table>

                ${
                  notes
                    ? `
                  <div style="margin-top: 18px; font-size: 14px; font-weight: 700;">Notes</div>
                  <div style="margin-top: 6px; padding: 12px; background:#f9fafb; border: 1px solid #eee; border-radius: 10px; white-space: pre-wrap;">${notes}</div>
                `
                    : ""
                }
              </td>
            </tr>

            <tr>
              <td style="padding: 14px 20px; background:#f9fafb; color:#6b7280; font-size: 12px;">
                This email was sent by Moore Equine Special Order Automation.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}
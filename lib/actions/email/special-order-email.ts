"use server"
import Mailgun from "mailgun.js"
import formData from "form-data"
import { SpecialOrderEmail } from "../special-order/special-order-interfaces"
import { renderSpecialOrderEmailHtml } from "./templates/special-order-template"
const mailgun = new Mailgun(formData)

const mailKey = process.env.MAILGUN_KEY
const baseDomain = process.env.MAILGUN_BASE_DOMAIN
const fromEmail = process.env.FROM_EMAIL

export async function sendSpecialOrderEmail(
  addresses: string[],
  specialOrder: SpecialOrderEmail
) {
  console.log("[EMAIL] START");

  if (!mailKey || !baseDomain || !fromEmail) {
    console.error("[EMAIL] MISSING ENV", {
      hasMailKey: Boolean(mailKey),
      hasBaseDomain: Boolean(baseDomain),
      hasFromEmail: Boolean(fromEmail),
    });

    throw new Error("Missing essential env variables");
  }

  console.log("[EMAIL] ENV OK", {
    baseDomain,
    fromEmail,
    recipientCount: addresses.length,
    recipients: addresses,
  });

  const mg = mailgun.client({
    username: "api",
    key: mailKey,
  });

  const html = renderSpecialOrderEmailHtml(specialOrder);

  console.log("[EMAIL] HTML RENDERED", {
    specialOrderId: specialOrder.id,
    supplierName: specialOrder.supplierName,
  });

  try {
    console.log("[EMAIL] CALLING MAILGUN");

    const data = await mg.messages.create(baseDomain, {
      from: fromEmail,
      to: addresses,
      subject: `${specialOrder.supplierName} Special Order`,
      text: `
${specialOrder.supplierName} Special Order

A new special order has been submitted.

Customer: ${specialOrder.customer}
Supplier: ${specialOrder.supplierName}

Please log in to review the order details.
      `,
      html,
    });

    console.log("[EMAIL] MAILGUN SUCCESS", data);

    return data;
  } catch (error) {
    console.error("[EMAIL] MAILGUN FAILURE", error);

    throw new Error("email send failed", { cause: error });
  }
}
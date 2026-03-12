"use server"
import Mailgun from "mailgun.js"
import formData from "form-data"
import { SpecialOrderEmail } from "../special-order/special-order-interfaces"
import { renderSpecialOrderEmailHtml } from "./templates/special-order-template"
const mailgun = new Mailgun(formData)

const mailKey = process.env.MAILGUN_KEY
const baseDomain = process.env.MAILGUN_BASE_DOMAIN
const fromEmail = process.env.FROM_EMAIL

export async function sendSpecialOrderEmail(adresses: string[], specialOrder: SpecialOrderEmail) {
    if (!mailKey || !baseDomain || !fromEmail) throw new Error("Missing essencial env variables")
    const mg = mailgun.client({
        username: "api",
        key: mailKey
    })

    const html = renderSpecialOrderEmailHtml(specialOrder)

    try {
        const data = await mg.messages.create(baseDomain, {
            from: fromEmail, 
            to: adresses,
            subject: `${specialOrder.supplierName} Special Order`,
            text: `
                ${specialOrder.supplierName} Special Order

                A new special order has been submitted.

                Customer: ${specialOrder.customer}
                Supplier: ${specialOrder.supplierName}

                Please log in to review the order details.
            `,
            html
        })
    } catch (error: any) {
        console.error(error)
        throw new Error("email send failed", error.message)
    }
}


"use server"
import Mailgun from "mailgun.js"
import formData from "form-data"
import { SpecialOrderEmail } from "../special-order/special-order-interfaces"
import { renderSpecialOrderEmailHtml } from "./templates/special-order-template"
const mailgun = new Mailgun(formData)

const mailKey = process.env.MAILGUN_KEY ?? ""
const mailDomain = process.env.MAILGUN_SANDBOX_DOMAIN ?? ""
const sandboxEmail = process.env.SANDBOX_EMAIL ?? ""



export async function sendSpecialOrderEmail(adresses: string[], specialOrder: SpecialOrderEmail) {
    console.log(mailKey)
    const mg = mailgun.client({
        username: "api",
        key: mailKey
    })

    const html = renderSpecialOrderEmailHtml(specialOrder)

    try {
        const data = await mg.messages.create(mailDomain, {
            from: sandboxEmail, 
            to: adresses,
            subject: `Special Order`,
            text: `Special Order for ${specialOrder.supplierName}`,
            html
        })
    } catch (error: any) {
        console.error(error)
        throw new Error("email send failed", error.message)
    }
}
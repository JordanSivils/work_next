"use server"
import prisma from "@/lib/prisma-export/prisma-client";
import { SpecialOrderCreate, SpecialOrderEmail, specialOrderEmailSchema, specialOrderItemsArray } from "./special-order-interfaces";
import { sendSpecialOrderEmail } from "../email/special-order-email";
import { auth } from "@clerk/nextjs/server";
import { reqRoles } from "../require-auth";

const managerOneEmail = process.env.MANAGER_ONE_EMAIL
const managerTwoEmail = process.env.MANAGER_TWO_EMAIL
const managerThreeEmail = process.env.MANAGER_THREE_EMAIL



export async function specialOrderCreate(fd: SpecialOrderCreate) {
  console.log("[SO] START")

  await reqRoles.loggedIn()

  const { userId } = await auth()
  console.log("[SO] USER ID:", userId)

  if (!userId) throw new Error("No user signed in")

  try {
    const creatorId = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    })

    console.log("[SO] CREATOR ID:", creatorId?.id)

    const createSpecialOrder = await prisma.specialOrder.create({
      data: {
        ...fd,
        createdById: creatorId?.id
      },
      include: {
        Supplier: {
          include: { User: true }
        },
        User: true
      }
    })

    console.log("[SO] DB CREATE SUCCESS:", createSpecialOrder.id)

    const parsedItems = specialOrderItemsArray.safeParse(createSpecialOrder.items)

    console.log("[SO] ITEMS PARSED:", parsedItems.success)

    const mappedSpecialOrderEmail: SpecialOrderEmail = {
      id: createSpecialOrder.id,
      items: parsedItems.success ? parsedItems.data : [],
      notes: createSpecialOrder.notes ?? undefined,
      supplierName: createSpecialOrder.Supplier?.name,
      customer: createSpecialOrder.customer ?? undefined,
      customerContact: createSpecialOrder.customerContact ?? undefined,
      orderStatus: createSpecialOrder.orderStatus,
      existingItem: createSpecialOrder.existingItem ?? false,
      recurring: createSpecialOrder.recurring,
      createAt: createSpecialOrder.createdAt,
      createdBy: `${createSpecialOrder.User?.firstName ?? ""} ${createSpecialOrder.User?.lastName ?? ""}`,
    }

    if (!managerOneEmail || !managerTwoEmail || !managerThreeEmail) {
      console.error("[SO] ENV EMAILS MISSING")
      throw new Error("env emails missing")
    }

    const employeeEmails = [
      managerOneEmail,
      managerTwoEmail,
      managerThreeEmail
    ]

    const emails = createSpecialOrder.Supplier?.User?.email
      ? [createSpecialOrder.Supplier.User.email]
      : employeeEmails

    console.log("[SO] EMAIL TARGETS:", emails)

    console.log("[SO] CALLING EMAIL FUNCTION")

    const result = await sendSpecialOrderEmail(
      emails,
      mappedSpecialOrderEmail
    )

    console.log("[SO] EMAIL RESULT:", result)

    console.log("[SO] COMPLETE SUCCESS")

    return { success: true }

  } catch (error) {
    console.error("[SO] FAILURE:", error)
    throw error
  }
}
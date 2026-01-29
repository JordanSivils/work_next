import { useUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export const reqRoles = {
    allowRoles: async (allowed: string[]) => {
        const { userId, sessionClaims } = await auth();
        if (!userId) throw new Error("Not signed in")

        const roles = (sessionClaims.role  ?? []) as string[] //ai help
        console.log(roles)
        const allow = allowed.some((r) => roles.includes(r))
        if(!allow) throw new Error("Sorry, It looks like you are not authorized")
    },
    loggedIn: async () => {
        const { isAuthenticated } = await auth();
        if (!isAuthenticated) throw new Error("Not signed in")
    },
    account: async () => {
        const { isAuthenticated, userId } = await auth();
        if (!isAuthenticated) throw new Error("Not Authenticated");
        if (!userId) throw new Error("Not Signed in");
        return userId
    }
}
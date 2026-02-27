"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignedIn, SignedOut, useAuth, useSignIn } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { ClerkAPIError } from "@clerk/types"
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface UserCredentials {
    email: string
    password: string
}

export function SignInForm() {
    const { isLoaded, signIn, setActive } = useSignIn()
    const [errors, setErrors] = useState<ClerkAPIError[]>();
    const { handleSubmit, register } = useForm<UserCredentials>()
    const router = useRouter()

    const { isSignedIn } = useAuth();

    if (isSignedIn) {
        redirect("/")
    }


    const onSubmit: SubmitHandler<UserCredentials> = async (data) => {

        setErrors(undefined);

        if (!isLoaded) return

        const password = data.password
        try {
            const signInAttempt = await signIn?.create({
                identifier: data.email,
                password
            })

            if (!signInAttempt) {
                throw new Error("probs")
            }
            

            if (signInAttempt?.status === "complete") {
                await setActive({
                    session: signInAttempt.createdSessionId,
                })
                router.push('/')
                return
            } 
        } catch (err) {
            if (isClerkAPIResponseError(err)) setErrors(err.errors)
        }
    }

    return (
        <>
        <SignedOut>
            <div className="w-full h-screen flex justify-center items-center">
            <Card className="w-100">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter Username and Password</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="text" {...register("email")} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...register("password")} />
                        </div>
                        <div>
                            {errors && (
                                <ul>
                                    {errors.map((el, index) => (
                                        <li key={index}>{el.longMessage}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="text-end">
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                    
                </CardContent>
            </Card>
        </div>
        </SignedOut>
        </>
        
    )
}
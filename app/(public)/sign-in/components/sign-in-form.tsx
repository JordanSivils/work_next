"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignedIn, SignedOut, useAuth, useSignIn } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { ClerkAPIError } from "@clerk/types"
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signInSchema = z.object({
    username: z.string().trim().min(1),
    password: z.string().min(6)
})
type SignIn = z.infer<typeof signInSchema>

export function SignInForm() {
    const { isLoaded, signIn, setActive } = useSignIn()
    const router = useRouter()
    const { isSignedIn } = useAuth();

    const [errors, setErrors] = useState<ClerkAPIError[]>();
    const { 
        handleSubmit, 
        register,
        formState: { isSubmitting, isValid }
    } = useForm<SignIn>({
        resolver: zodResolver(signInSchema),
        mode: "onChange",
        defaultValues: {
            username: "",
            password: ""
        }
    })
    

    

    useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);


    const onSubmit: SubmitHandler<SignIn> = async (data) => {

        setErrors(undefined);

        if (!isLoaded) return

        const password = data.password
        const identifier = data.username
        try {
            const signInAttempt = await signIn?.create({
                identifier,
                password
            })

            if (!signInAttempt) {
                throw new Error("probs")
            }
            

            if (signInAttempt?.status === "complete") {
                await setActive({
                    session: signInAttempt.createdSessionId,
                })
                router.replace("/")
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
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" type="text" {...register("username")} />
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
                            <Button 
                            disabled={!isValid || isSubmitting} 
                            type="submit"
                            className={!isValid || isSubmitting ? "bg-gray-400" : ""}
                            >Submit</Button>
                        </div>
                    </form>
                    
                </CardContent>
            </Card>
        </div>
        </SignedOut>
        </>
        
    )
}
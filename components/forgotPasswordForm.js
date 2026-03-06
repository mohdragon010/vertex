"use client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { auth } from "@/lib/firebase"
import { sendPasswordResetEmail } from "firebase/auth"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)
    const [email, setEmail] = useState("")

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Please enter your email address");
            return;
        }

        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setIsLoading(false);
            setShowSuccessDialog(true);
        } catch (err) {
            console.error("Reset error:", err);
            if (err.code === "auth/user-not-found") {
                setError("No account found with this email.");
            } else if (err.code === "auth/invalid-email") {
                setError("Invalid email address.");
            } else {
                setError("An error occurred. Please try again later.");
            }
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <Card className="border-border/60 shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
                    <CardDescription>
                        Enter your email and we'll send you a link to reset your password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleResetPassword}>
                        <FieldGroup>
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md border border-destructive/20 mb-2 flex items-center gap-2"
                                    >
                                        <span className="w-1 h-1 bg-destructive rounded-full" />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        className="pl-10"
                                        value={email}
                                        disabled={isLoading}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </Field>

                            <Field className="pt-2">
                                <Button type="submit" disabled={isLoading} className="w-full font-semibold shadow-sm transition-all active:scale-[0.98]">
                                    {isLoading ? (
                                        <>
                                            <Spinner className="mr-2" />
                                            Sending link...
                                        </>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>

                                <div className="flex justify-center mt-6">
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
                                    >
                                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                                        Back to login
                                    </Link>
                                </div>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="flex flex-col items-center justify-center text-center gap-3">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl">Email Sent</DialogTitle>
                            <DialogDescription className="text-base text-balance">
                                Check your email <span className="font-semibold text-foreground">{email}</span> for a link to reset your password.
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center">
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button
                                type="button"
                                className="w-full sm:w-32 font-semibold"
                            >
                                Go to Login
                            </Button>
                        </Link>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

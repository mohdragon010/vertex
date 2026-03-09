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
import useAuth from "@/hooks/useAuth"
import { auth, db } from "@/lib/firebase"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function SignupForm() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)
    const [isSigningUp, setIsSigningUp] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (user && !authLoading && !isSigningUp) {
            router.push("/")
        }
    }, [user, authLoading, router, isSigningUp])

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setError("");

        // Basic validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("Please fill in all fields");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setIsSigningUp(true);
        setIsLoading(true);
        
        const collectionRef = collection(db, "users");
        const q = query(collectionRef, where("email", "==", formData.email));
        const querySnap = await getDocs(q);
        if(!querySnap.empty){
            setError("Email already exists");
            setIsSigningUp(false);
            setIsLoading(false);
            return;
        }
        try {
            const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const userDocRef = doc(db, "users", cred.user.uid);
            await setDoc(userDocRef, {
                name: formData.name,
                email: formData.email,
                createdAt: serverTimestamp(),
            });

            await sendEmailVerification(cred.user);

            setIsLoading(false);
            setShowSuccessDialog(true);
        } catch (err) {
            setIsSigningUp(false);
            if (err.code === "auth/email-already-in-use") {
                setError("This email is already in use.");
            } else if (err.code === "auth/invalid-email") {
                setError("Invalid email address.");
            } else if (err.code === "auth/weak-password") {
                setError("Password is too weak.");
            } else {
                setError("An error occurred during signup. Please try again.");
            }
            setIsLoading(false);
        }
    }

    const handleSuccessClose = () => {
        setShowSuccessDialog(false);
        router.push("/");
    };

    return (
        <div className="flex flex-col gap-6">
            <Card className="border-border/60 shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Create your account</CardTitle>
                    <CardDescription>
                        Join Vertex today and start managing your workspace
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateAccount}>
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
                                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Mohamed Ayman"
                                        className="pl-10"
                                        required
                                        disabled={isLoading}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        value={formData.name}
                                    />
                                </div>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        className="pl-10"
                                        value={formData.email}
                                        disabled={isLoading}
                                        onChange={(e) => { setFormData({ ...formData, email: e.target.value }) }}
                                        required
                                    />
                                </div>
                            </Field>

                            <Field>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                className="pl-10 pr-10"
                                                value={formData.password}
                                                disabled={isLoading}
                                                onChange={(e) => { setFormData({ ...formData, password: e.target.value }) }}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="confirm-password">
                                            Confirm Password
                                        </FieldLabel>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                            <Input
                                                id="confirm-password"
                                                type={showPassword ? "text" : "password"}
                                                className="pl-10"
                                                value={formData.confirmPassword}
                                                disabled={isLoading}
                                                onChange={e => { setFormData({ ...formData, confirmPassword: e.target.value }) }}
                                                required
                                            />
                                        </div>
                                    </Field>
                                </div>
                                <FieldDescription>
                                    Must be at least 8 characters long.
                                </FieldDescription>
                            </Field>

                            <Field className="pt-2">
                                <Button type="submit" disabled={isLoading} className="w-full font-semibold shadow-sm transition-all active:scale-[0.98]">
                                    {isLoading ? (
                                        <>
                                            <Spinner className="mr-2" />
                                            Creating account...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </Button>
                                <FieldDescription className="text-center mt-4">
                                    Already have an account? <Link href="/login" className="text-primary font-medium hover:underline underline-offset-4">Login</Link>
                                </FieldDescription>
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
                            <DialogTitle className="text-2xl">Check your email</DialogTitle>
                            <DialogDescription className="text-base text-balance">
                                We've sent a verification link to <span className="font-semibold text-foreground">{formData.email}</span>.
                                Please verify your email to complete your registration.
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center">
                        <Button
                            type="button"
                            className="w-full sm:w-32 font-semibold"
                            onClick={handleSuccessClose}
                        >
                            Got it!
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

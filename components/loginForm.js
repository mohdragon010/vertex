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
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import useAuth from "@/hooks/useAuth"
import { auth, db } from "@/lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { collection, doc, getDocs, query } from "firebase/firestore"
import { AnimatePresence, motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function LoginForm() {
    const { user, loading: authLoading, logout } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    useEffect(() => {
        if (user && !authLoading) {
            router.push("/")
        }
    }, [user, authLoading, router])

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            return;
        }

        const usersCollectionRef = collection(db, "users")
        const q = query(
            usersCollectionRef,
            where("email", "==", formData.email)
        );
        const userDoc = await getDocs(q);
        if (userDoc.empty) {
            setError("User not found");
            logout();
            setIsLoading(false)
            return;
        }

        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
        } catch (err) {
            if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
                setError("Invalid email or password.");
            } else if (err.code === "auth/too-many-requests") {
                setError("Too many failed attempts. Please try again later.");
            } else {
                setError("An error occurred during login. Please try again.");
            }
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <Card className="border-border/60 shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Login to your account</CardTitle>
                    <CardDescription>
                        Enter your credentials to access your Vertex workspace
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin}>
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
                                        value={formData.email}
                                        disabled={isLoading}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </Field>

                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Link
                                        href="/forgot-password"
                                        className="ml-auto inline-block text-sm font-medium text-primary hover:underline underline-offset-4"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className="pl-10 pr-10"
                                        value={formData.password}
                                        disabled={isLoading}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                            <Field className="pt-2">
                                <Button type="submit" disabled={isLoading} className="w-full font-semibold shadow-sm transition-all active:scale-[0.98]">
                                    {isLoading ? (
                                        <>
                                            <Spinner className="mr-2" />
                                            Logging in...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                                <FieldDescription className="text-center mt-4">
                                    Don't have an account? <Link href="/signup" className="text-primary font-medium hover:underline underline-offset-4">Sign up</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

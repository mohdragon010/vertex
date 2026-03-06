"use client"

import { LayoutDashboard } from "lucide-react"
import { motion } from "framer-motion"
import { SignupForm } from "@/components/signupForm"
import { LoginForm } from "@/components/loginForm"

export default function Signup() {
    return (
        <div className="max-w-full overflow-hidden">
            <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
                <div className="flex w-full max-w-sm flex-col gap-6">
                    <motion.a href="/" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 self-center font-medium">
                        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <LayoutDashboard className="size-4"/>
                        </div>
                        Vertex
                    </motion.a>
                    {/* form */}
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}
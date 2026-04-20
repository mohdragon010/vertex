"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { ShieldCheck, Mail, LogOut, Check, Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import SettingsSection from "./SettingsSection";

export default function SettingsSecurity({ user, logout }) {
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");

    const handleResetPassword = async () => {
        if (!user?.email) return;
        setStatus("loading");
        setError("");
        try {
            await sendPasswordResetEmail(auth, user.email);
            setStatus("sent");
            setTimeout(() => setStatus("idle"), 4000);
        } catch (err) {
            console.error(err);
            setStatus("idle");
            setError("Could not send reset email. Please try again.");
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <SettingsSection
                title="Security"
                description="Manage authentication and access."
            >
                <div className="divide-y divide-border/50">
                    <div className="flex items-start justify-between gap-4 py-4">
                        <div className="flex items-start gap-3 min-w-0">
                            <ShieldCheck className="w-4 h-4 mt-0.5 text-muted-foreground" />
                            <div className="min-w-0">
                                <p className="text-sm font-medium">Password</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    We'll email a secure reset link to {user?.email}.
                                </p>
                                {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResetPassword}
                            disabled={status === "loading" || status === "sent"}
                        >
                            {status === "loading" && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                            {status === "sent" ? (
                                <>
                                    <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Email sent
                                </>
                            ) : (
                                "Reset password"
                            )}
                        </Button>
                    </div>

                    <div className="flex items-start justify-between gap-4 py-4">
                        <div className="flex items-start gap-3 min-w-0">
                            <Mail className="w-4 h-4 mt-0.5 text-muted-foreground" />
                            <div className="min-w-0">
                                <p className="text-sm font-medium">Email verification</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {user?.emailVerified
                                        ? "Your email has been verified."
                                        : "Please verify your email to unlock all features."}
                                </p>
                            </div>
                        </div>
                        {user?.emailVerified ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-500 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <Check className="w-3 h-3" /> Verified
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                                Not verified
                            </span>
                        )}
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Session" description="End your current session on this device.">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                        <LogOut className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div className="min-w-0">
                            <p className="text-sm font-medium">Log out</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                You'll need to sign in again to access your workspaces.
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={logout}>
                        Log out
                    </Button>
                </div>
            </SettingsSection>
        </div>
    );
}


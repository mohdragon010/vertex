"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Palette, Bell, Shield } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import SettingsNav from "@/components/settings/SettingsNav";
import SettingsAccount from "@/components/settings/SettingsAccount";
import SettingsAppearance from "@/components/settings/SettingsAppearance";
import SettingsNotifications from "@/components/settings/SettingsNotifications";
import SettingsSecurity from "@/components/settings/SettingsSecurity";

const SECTIONS = [
    { key: "account", label: "Account", icon: User },
    { key: "appearance", label: "Appearance", icon: Palette },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
    const router = useRouter();
    const { user, userDoc, loading, logout } = useAuth();
    const [active, setActive] = useState("account");

    useEffect(() => {
        if (!loading && !user) router.push("/login");
    }, [loading, user, router]);

    if (loading) {
        return (
            <main className="container mx-auto px-6 py-10 max-w-5xl">
                <div className="h-8 w-40 bg-muted rounded animate-pulse mb-6" />
                <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
                    <div className="h-40 bg-card border border-border/50 rounded-xl animate-pulse" />
                    <div className="h-96 bg-card border border-border/50 rounded-xl animate-pulse" />
                </div>
            </main>
        );
    }

    if (!user) return null;

    return (
        <main className="container mx-auto px-6 py-10 max-w-5xl min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your account, preferences, and security.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5 items-start">
                <SettingsNav sections={SECTIONS} active={active} onChange={setActive} />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                    >
                        {active === "account" && (
                            <SettingsAccount userDoc={userDoc} user={user} />
                        )}
                        {active === "appearance" && <SettingsAppearance />}
                        {active === "notifications" && (
                            <SettingsNotifications userDoc={userDoc} user={user} />
                        )}
                        {active === "security" && (
                            <SettingsSecurity user={user} logout={logout} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </main>
    );
}


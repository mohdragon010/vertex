"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { motion } from "framer-motion";
import useAuth from "@/hooks/useAuth";
import useNotifications from "@/hooks/useNotifications";
import { markAllNotificationsRead } from "@/lib/notifications";
import NotificationItem from "@/components/notifications/NotificationItem";

const TABS = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "invite", label: "Invitations" },
];

export default function NotificationsPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { notifications, unreadCount, loading } = useNotifications();
    const [tab, setTab] = useState("all");

    useEffect(() => {
        if (!authLoading && !user) router.push("/login");
    }, [authLoading, user, router]);

    const filtered = useMemo(() => {
        if (tab === "unread") return notifications.filter((n) => !n.read);
        if (tab === "invite") return notifications.filter((n) => n.type === "invite");
        return notifications;
    }, [tab, notifications]);

    if (authLoading || loading) {
        return (
            <main className="container mx-auto px-6 py-10 max-w-3xl">
                <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
                <div className="h-64 bg-card border border-border/50 rounded-xl animate-pulse" />
            </main>
        );
    }

    if (!user) return null;

    return (
        <main className="container mx-auto px-6 py-10 max-w-3xl min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-end justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        Notifications
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {unreadCount > 0
                            ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`
                            : "You're all caught up."}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={() => markAllNotificationsRead(user.uid)}
                        className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-border/50 text-foreground hover:bg-secondary transition-colors"
                    >
                        <CheckCheck className="w-4 h-4" />
                        Mark all read
                    </button>
                )}
            </motion.div>

            <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
                <div className="flex items-center gap-1 px-3 py-2 border-b border-border/50 overflow-x-auto">
                    {TABS.map((t) => {
                        const active = tab === t.key;
                        return (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`relative px-3 py-1.5 text-sm rounded-md transition-colors ${
                                    active
                                        ? "text-vertex-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {t.label}
                                {active && (
                                    <motion.span
                                        layoutId="notif-tab-underline"
                                        className="absolute left-2 right-2 -bottom-2 h-0.5 bg-vertex-primary"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-12 h-12 mx-auto rounded-full bg-secondary flex items-center justify-center mb-3">
                            <Inbox className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">Nothing here</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {tab === "unread"
                                ? "You've read everything."
                                : tab === "invite"
                                    ? "You have no pending invitations."
                                    : "You don't have any notifications yet."}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/40">
                        {filtered.map((n) => (
                            <NotificationItem key={n.id} notification={n} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}


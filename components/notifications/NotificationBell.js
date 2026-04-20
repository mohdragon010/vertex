"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import useAuth from "@/hooks/useAuth";
import useNotifications from "@/hooks/useNotifications";
import { markAllNotificationsRead } from "@/lib/notifications";
import NotificationItem from "./NotificationItem";

export default function NotificationBell() {
    const { user } = useAuth();
    const { notifications, unreadCount, loading } = useNotifications();
    const [open, setOpen] = useState(false);
    const panelRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (
                panelRef.current?.contains(e.target) ||
                buttonRef.current?.contains(e.target)
            )
                return;
            setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    if (!user) return null;

    const preview = notifications.slice(0, 8);

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setOpen((v) => !v)}
                className="relative p-2 rounded-full text-muted-foreground hover:text-vertex-primary hover:bg-accent transition-colors"
                aria-label="Notifications"
            >
                <Bell size={20} strokeWidth={2.2} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-vertex-primary text-white text-[10px] font-semibold flex items-center justify-center border-2 border-background">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        ref={panelRef}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] bg-popover border border-border/60 rounded-xl shadow-lg overflow-hidden z-50"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-vertex-primary/10 text-vertex-primary">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllNotificationsRead(user.uid)}
                                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <CheckCheck className="w-3.5 h-3.5" />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[420px] overflow-y-auto divide-y divide-border/40">
                            {loading ? (
                                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                                    Loading...
                                </div>
                            ) : preview.length === 0 ? (
                                <div className="px-4 py-10 text-center">
                                    <div className="w-10 h-10 mx-auto rounded-full bg-secondary flex items-center justify-center mb-2">
                                        <Bell className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm font-medium">You're all caught up</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        No notifications yet.
                                    </p>
                                </div>
                            ) : (
                                preview.map((n) => (
                                    <NotificationItem
                                        key={n.id}
                                        notification={n}
                                        onClose={() => setOpen(false)}
                                    />
                                ))
                            )}
                        </div>

                        <div className="px-4 py-2.5 border-t border-border/50 text-center">
                            <Link
                                href="/notifications"
                                onClick={() => setOpen(false)}
                                className="text-xs font-medium text-vertex-primary hover:underline"
                            >
                                View all notifications
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


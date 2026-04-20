"use client";

import Link from "next/link";
import { Bell, Mail, CheckCircle2, XCircle, UserPlus, Info } from "lucide-react";
import { markNotificationRead } from "@/lib/notifications";
import InviteActions from "./InviteActions";

const TYPE_META = {
    invite: { icon: UserPlus, tone: "text-vertex-primary bg-vertex-primary/10" },
    "invite-accepted": { icon: CheckCircle2, tone: "text-emerald-500 bg-emerald-500/10" },
    "invite-declined": { icon: XCircle, tone: "text-rose-500 bg-rose-500/10" },
    "task-assigned": { icon: Mail, tone: "text-amber-500 bg-amber-500/10" },
    info: { icon: Info, tone: "text-muted-foreground bg-secondary" },
};

function relative(value) {
    if (!value) return "";
    const date = value?.toDate?.() || (value?.seconds ? new Date(value.seconds * 1000) : null);
    if (!date) return "";
    const diff = Date.now() - date.getTime();
    const mins = Math.round(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.round(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function NotificationItem({ notification, variant = "list", onClose }) {
    const meta = TYPE_META[notification.type] || TYPE_META.info;
    const Icon = meta.icon;
    const isInvite = notification.type === "invite";

    const Wrapper = ({ children }) =>
        !isInvite && notification.link ? (
            <Link
                href={notification.link}
                onClick={() => {
                    if (!notification.read) markNotificationRead(notification.id);
                    onClose?.();
                }}
                className="block"
            >
                {children}
            </Link>
        ) : (
            <div>{children}</div>
        );

    return (
        <div
            className={`px-4 py-3 transition-colors ${
                !notification.read ? "bg-vertex-primary/[0.03]" : ""
            } ${variant === "list" ? "hover:bg-secondary/40" : ""}`}
        >
            <Wrapper>
                <div className="flex items-start gap-3">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${meta.tone}`}
                    >
                        <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium leading-snug">
                                {notification.title}
                            </p>
                            {!notification.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-vertex-primary mt-1.5 shrink-0" />
                            )}
                        </div>
                        {notification.message && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {notification.message}
                            </p>
                        )}
                        <p className="text-[11px] text-muted-foreground mt-1">
                            {relative(notification.createdAt)}
                        </p>

                        {isInvite && (
                            <div className="mt-2.5">
                                <InviteActions notification={notification} />
                            </div>
                        )}
                    </div>

                    {!isInvite && !notification.read && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                markNotificationRead(notification.id);
                            }}
                            title="Mark as read"
                            className="opacity-0 group-hover:opacity-100 text-[11px] text-muted-foreground hover:text-foreground transition-opacity"
                        >
                            Mark read
                        </button>
                    )}
                </div>
            </Wrapper>
        </div>
    );
}


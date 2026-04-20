"use client";

import { useEffect, useMemo, useRef } from "react";
import { MessageSquare } from "lucide-react";
import MessageItem from "./MessageItem";

const GROUP_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function toDate(value) {
    return value?.toDate?.() || null;
}

function sameDay(a, b) {
    if (!a || !b) return false;
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function formatDayLabel(date) {
    if (!date) return "";
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (sameDay(date, today)) return "Today";
    if (sameDay(date, yesterday)) return "Yesterday";
    return date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
    });
}

export default function MessageList({ messages, workspaceId, currentUserId, isAdmin, members, loading }) {
    const scrollRef = useRef(null);
    const lastCountRef = useRef(0);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        // Auto-scroll to bottom if new messages arrived and user is near the bottom.
        const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;
        if (messages.length > lastCountRef.current && (isNearBottom || lastCountRef.current === 0)) {
            el.scrollTop = el.scrollHeight;
        }
        lastCountRef.current = messages.length;
    }, [messages]);

    const rows = useMemo(() => {
        const out = [];
        let prev = null;
        let prevDate = null;
        for (const m of messages) {
            const date = toDate(m.createdAt);
            const showDay = !prevDate || !sameDay(prevDate, date);
            const sameAuthor = prev && prev.authorId === m.authorId && !showDay;
            const closeInTime =
                prev && date && toDate(prev.createdAt) &&
                Math.abs(date - toDate(prev.createdAt)) < GROUP_WINDOW_MS;
            const showHeader = !sameAuthor || !closeInTime;
            out.push({ type: "msg", message: m, showHeader, showDay, date });
            prev = m;
            if (date) prevDate = date;
        }
        return out;
    }, [messages]);

    if (loading) {
        return (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!messages.length) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">Start the conversation</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    Say hi to your teammates. Messages sent here are visible to every member of this workspace.
                </p>
            </div>
        );
    }

    return (
        <div ref={scrollRef} className="flex-1 overflow-y-auto py-3">
            {rows.map((row) => (
                <div key={row.message.id}>
                    {row.showDay && (
                        <div className="flex items-center gap-3 px-4 my-4">
                            <div className="flex-1 h-px bg-border/50" />
                            <span className="text-[11px] text-muted-foreground font-medium">
                                {formatDayLabel(row.date)}
                            </span>
                            <div className="flex-1 h-px bg-border/50" />
                        </div>
                    )}
                    <MessageItem
                        message={row.message}
                        workspaceId={workspaceId}
                        currentUserId={currentUserId}
                        isAdmin={isAdmin}
                        members={members}
                        showHeader={row.showHeader}
                    />
                </div>
            ))}
        </div>
    );
}


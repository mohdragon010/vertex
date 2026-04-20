"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { respondToInvitation, markNotificationRead } from "@/lib/notifications";
import useAuth from "@/hooks/useAuth";

export default function InviteActions({ notification, onDone }) {
    const { user } = useAuth();
    const [status, setStatus] = useState("idle"); // idle | loading | done
    const [error, setError] = useState("");

    const inviteId = notification?.meta?.inviteId;

    const handle = async (accept) => {
        if (!user?.uid || !inviteId) return;
        setStatus("loading");
        setError("");
        try {
            await respondToInvitation({ inviteId, accept, userId: user.uid });
            await markNotificationRead(notification.id);
            setStatus("done");
            onDone?.(accept);
        } catch (err) {
            console.error(err);
            setError(err.message || "Something went wrong");
            setStatus("idle");
        }
    };

    if (status === "done") {
        return (
            <p className="text-xs text-muted-foreground italic">
                You responded to this invitation.
            </p>
        );
    }

    const loading = status === "loading";

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => handle(true)}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-vertex-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    Accept
                </button>
                <button
                    onClick={() => handle(false)}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border/50 text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                >
                    <X className="w-3 h-3" />
                    Decline
                </button>
            </div>
            {error && <p className="text-xs text-rose-500">{error}</p>}
        </div>
    );
}


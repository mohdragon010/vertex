"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TaskAssignee({ uid, size = "sm", showEmail = false }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(Boolean(uid));

    useEffect(() => {
        if (!uid) {
            setUserData(null);
            setLoading(false);
            return;
        }
        let cancelled = false;
        setLoading(true);
        getDoc(doc(db, "users", uid))
            .then((snap) => {
                if (cancelled) return;
                if (snap.exists()) setUserData({ id: snap.id, ...snap.data() });
                else setUserData({ id: uid, name: "Unknown", email: "" });
            })
            .catch(() => {
                if (!cancelled) setUserData({ id: uid, name: "Unknown", email: "" });
            })
            .finally(() => !cancelled && setLoading(false));

        return () => {
            cancelled = true;
        };
    }, [uid]);

    if (!uid) {
        return <span className="text-sm text-muted-foreground">Unassigned</span>;
    }

    const avatarSize = size === "lg" ? "w-8 h-8 text-sm" : "w-6 h-6 text-xs";

    if (loading) {
        return (
            <div className="flex items-center gap-2">
                <div className={`${avatarSize} rounded-full bg-muted animate-pulse`} />
                <div className="h-3 w-20 bg-muted rounded animate-pulse" />
            </div>
        );
    }

    const label = userData?.name || userData?.email || "Unknown";
    const initial = (userData?.name || userData?.email || "U").charAt(0).toUpperCase();

    return (
        <div className="flex items-center gap-2 min-w-0">
            <div
                className={`${avatarSize} rounded-full bg-vertex-primary/10 text-vertex-primary flex items-center justify-center font-semibold shrink-0`}
            >
                {initial}
            </div>
            <div className="min-w-0">
                <p className="text-sm font-medium truncate">{label}</p>
                {showEmail && userData?.email && userData.name && (
                    <p className="text-xs text-muted-foreground truncate">{userData.email}</p>
                )}
            </div>
        </div>
    );
}


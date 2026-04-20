"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useAuth from "@/hooks/useAuth";

/**
 * Subscribes to the current user's notifications (newest first, client-sorted
 * to avoid requiring a composite index).
 */
export default function useNotifications() {
    const { user, loading: authLoading } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user?.uid) {
            setNotifications([]);
            setLoading(false);
            return;
        }

        const q = query(collection(db, "notifications"), where("userId", "==", user.uid));
        setLoading(true);

        const unsubscribe = onSnapshot(
            q,
            (snap) => {
                const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                list.sort((a, b) => {
                    const aTime = a.createdAt?.toMillis?.() || 0;
                    const bTime = b.createdAt?.toMillis?.() || 0;
                    return bTime - aTime;
                });
                setNotifications(list);
                setLoading(false);
            },
            (err) => {
                console.error("useNotifications error:", err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user?.uid, authLoading]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return { notifications, unreadCount, loading };
}


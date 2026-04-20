"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function useWorkspaceMessages(workspaceId) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!workspaceId) {
            setMessages([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const q = query(
            collection(db, "workspaces", workspaceId, "messages"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(
            q,
            (snap) => {
                const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                setMessages(data);
                setLoading(false);
            },
            (err) => {
                console.error("useWorkspaceMessages:", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [workspaceId]);

    return { messages, loading, error };
}


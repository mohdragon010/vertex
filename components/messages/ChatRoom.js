"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useWorkspaceMessages from "@/hooks/useWorkspaceMessages";
import MessageList from "./MessageList";
import MessageComposer from "./MessageComposer";

export default function ChatRoom({ workspace, user, userDoc }) {
    const { messages, loading, error } = useWorkspaceMessages(workspace?.id);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        let cancelled = false;
        const ids = workspace?.members || [];
        if (!ids.length) {
            setMembers([]);
            return;
        }
        (async () => {
            try {
                const results = await Promise.all(
                    ids.map(async (uid) => {
                        const snap = await getDoc(doc(db, "users", uid));
                        if (snap.exists()) return { id: snap.id, ...snap.data() };
                        return { id: uid, name: "Unknown", email: "" };
                    })
                );
                if (!cancelled) setMembers(results);
            } catch (err) {
                console.error("ChatRoom members fetch:", err);
            }
        })();
        return () => { cancelled = true; };
    }, [workspace?.members]);

    const isAdmin = workspace?.adminId === user?.uid;

    const author = {
        uid: user.uid,
        name: userDoc?.name || user.displayName || user.email,
        displayName: user.displayName,
        email: user.email,
        photoURL: userDoc?.photoURL || user.photoURL || "",
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-card border border-border/50 rounded-2xl overflow-hidden">
            {error && (
                <div className="px-4 py-2 text-xs text-rose-500 bg-rose-500/5 border-b border-rose-500/20">
                    Could not load messages: {error.message || "unknown error"}
                </div>
            )}
            <MessageList
                messages={messages}
                workspaceId={workspace.id}
                currentUserId={user.uid}
                isAdmin={isAdmin}
                members={members}
                loading={loading}
            />
            <MessageComposer workspaceId={workspace.id} author={author} />
        </div>
    );
}


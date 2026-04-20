"use client";

import useAuth from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, Users } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import ChatRoom from "@/components/messages/ChatRoom";

export default function WorkspaceChatPage() {
    const param = useParams();
    const router = useRouter();
    const { user, userDoc, loading: authLoading } = useAuth();
    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user?.uid) { router.push("/login"); return; }

        const q = query(
            collection(db, "workspaces"),
            where("slug", "==", param.workspaceSlug)
        );

        setLoading(true);
        const unsubscribe = onSnapshot(q, (snap) => {
            if (!snap.empty) {
                setWorkspace({ ...snap.docs[0].data(), id: snap.docs[0].id });
            } else {
                setWorkspace(null);
            }
            setLoading(false);
        }, (err) => {
            console.error("Chat workspace fetch:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user?.uid, authLoading, param.workspaceSlug, router]);

    if (loading || authLoading) {
        return (
            <div className="container mx-auto px-6 py-10 max-w-5xl">
                <Skeleton className="h-8 w-40 mb-6" />
                <Skeleton className="h-12 w-80 mb-8" />
                <Skeleton className="h-[60vh] w-full rounded-2xl" />
            </div>
        );
    }

    if (!workspace) {
        return (
            <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[70vh]">
                <h2 className="text-2xl font-semibold mb-3">Workspace not found</h2>
                <Link href="/workspaces" className="text-sm text-vertex-primary hover:underline">
                    Back to Workspaces
                </Link>
            </div>
        );
    }

    const isMember =
        workspace.members?.includes(user.uid) || workspace.adminId === user.uid;

    if (!isMember) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-2xl font-semibold mb-3">Access Denied</h2>
                <p className="text-muted-foreground mb-6 max-w-sm">
                    You aren't a member of this workspace, so you cannot access its chat.
                </p>
                <Link
                    href="/workspaces"
                    className="bg-vertex-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90"
                >
                    My Workspaces
                </Link>
            </div>
        );
    }

    const memberCount = (workspace.members?.length || 0);

    return (
        <div className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6"
            >
                <Link
                    href={`/workspaces/${workspace.slug}`}
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-vertex-primary transition-colors group"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to {workspace.name}
                </Link>
            </motion.div>

            <motion.header
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between flex-wrap gap-4 mb-6"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-vertex-primary/10 rounded-xl text-vertex-primary">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight leading-tight">
                            Team Chat
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {workspace.name}
                        </p>
                    </div>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 border border-border/50 px-3 py-1.5 rounded-full">
                    <Users className="w-3.5 h-3.5" />
                    {memberCount} {memberCount === 1 ? "member" : "members"}
                </div>
            </motion.header>

            <ChatRoom workspace={workspace} user={user} userDoc={userDoc} />
        </div>
    );
}


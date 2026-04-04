"use client"

import useAuth from "@/hooks/useAuth"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import WorkspaceGeneralSettings from "@/components/workspaceGeneralSettings"
import WorkspacePermissionsSettings from "@/components/workspacePermissionsSettings"
import WorkspaceDangerZone from "@/components/workspaceDangerZone"

export default function WorkspaceSettingsPage() {
    const param = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isNotAdmin, setIsNotAdmin] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!user?.uid) { router.push("/login"); return; }

        const collectionRef = collection(db, "workspaces");
        const q = query(collectionRef, where("slug", "==", param.workspaceSlug));

        setLoading(true);
        const unsubscribe = onSnapshot(q, (querySnap) => {
            if (!querySnap.empty) {
                const wsData = { ...querySnap.docs[0].data(), id: querySnap.docs[0].id };
                
                // Protection: Only admin can enter
                if (wsData.adminId !== user.uid) {
                    setIsNotAdmin(true);
                    setLoading(false);
                    return;
                }
                
                setWorkspace(wsData);
            } else {
                setWorkspace(null);
            }
            setLoading(false);
        }, (err) => {
            console.error("Error fetching workspace:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user?.uid, authLoading, param.workspaceSlug, router]);

    if (isNotAdmin) {
        return (
            <div className="container mx-auto px-6 py-12 max-w-5xl min-h-[70vh] flex items-center justify-center">
                <Dialog open={true} onOpenChange={() => router.push(`/workspaces/${param.workspaceSlug}`)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-destructive">Access Denied</DialogTitle>
                            <DialogDescription className="text-base text-foreground mt-2">
                                You aren't an admin of this workspace, so you don't have permission to modify its settings.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button className="bg-vertex-primary hover:bg-vertex-primary/90 text-white" onClick={() => router.push(`/workspaces/${param.workspaceSlug}`)}>
                                Got it
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-12 max-w-5xl">
                <Skeleton className="h-10 w-32 mb-8" />
                <div className="space-y-4">
                    <Skeleton className="h-16 w-full max-w-md" />
                    <Skeleton className="h-40 w-full" />
                </div>
            </div>
        )
    }

    if (!workspace) {
        return (
            <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[70vh]">
                <h2 className="text-3xl font-bold mb-4 text-center">Workspace not found</h2>
                <Link href="/workspaces">
                    <Button variant="outline" className="rounded-xl">Back to Workspaces</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-6 py-12 max-w-5xl min-h-screen">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-10"
            >
                <Link href={`/workspaces/${workspace.slug}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-vertex-primary transition-colors group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Workspace
                </Link>
            </motion.div>

            <header className="mb-16">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-vertex-primary/10 rounded-2xl text-vertex-primary">
                            <Settings className="w-8 h-8" />
                        </div>
                        <h1 className="text-5xl font-black tracking-tight uppercase selection:bg-vertex-primary selection:text-white">
                            Settings
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-xl max-w-2xl leading-relaxed font-medium">
                        Manage <strong className="text-foreground">{workspace.name}</strong> configuration, preferences, and data.
                    </p>
                </motion.div>
            </header>

            <div className="grid grid-cols-1 gap-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <WorkspaceGeneralSettings workspace={workspace} />
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <WorkspacePermissionsSettings workspace={workspace} />
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <WorkspaceDangerZone workspace={workspace} />
                </motion.div>
            </div>
        </div>
    )
}

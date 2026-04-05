"use client"

import { useParams } from "next/navigation";
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, CheckSquare, Circle, Clock, Plus } from "lucide-react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import dynamic from "next/dynamic";
const CreateTaskDialog = dynamic(() => import("@/components/createTaskDialog"), { ssr: false });

export default function Page() {
    const { workspaceSlug, projectId } = useParams();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState(null);
    const [workspace, setWorkspace] = useState(null);
    const [error, setError] = useState(null)

    useEffect(() => {
        const getProject = async () => {
            try {
                const workspaceCollectionRef = collection(db, "workspaces");
                const q = query(workspaceCollectionRef, where("slug", "==", workspaceSlug));
                setLoading(true)
                const unsubscribe = onSnapshot(q, querySnapshot => {
                    if (!querySnapshot.empty) {
                        const wsData = querySnapshot.docs[0].data();
                        setWorkspace(wsData);
                        const projects = wsData.projects || [];
                        setProject(projects.find(project => projectId == project.id))
                    } else {
                        setWorkspace(null);
                        setProject(null);
                    }
                    setLoading(false)
                }, err => {
                    console.error("Error while fetching data:", err);
                    setError("Something went wrong, check the console for more details")
                })
                return () => unsubscribe();
            } catch (err) {
                console.log(err)
            }
        };
        getProject()
    }, [])

    if (loading || authLoading) {
        return (
            <div className="container mx-auto px-6 py-10 max-w-7xl min-h-screen">
                <div className="mb-6 h-6 w-32 bg-muted animate-pulse rounded" />
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 items-start">
                    <div className="flex flex-col gap-5">
                        <div className="h-48 w-full bg-card border border-border/50 rounded-xl p-6 flex flex-col justify-center">
                            <h1 className="text-xl font-semibold text-muted-foreground animate-pulse mb-2">Loading Project Details...</h1>
                            <div className="h-4 w-3/4 bg-muted animate-pulse rounded mt-4" />
                        </div>
                        <div className="h-64 w-full bg-card border border-border/50 rounded-xl animate-pulse" />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="h-40 w-full bg-card border border-border/50 rounded-xl animate-pulse" />
                        <div className="h-32 w-full bg-card border border-border/50 rounded-xl animate-pulse" />
                    </div>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-2xl font-semibold mb-3 text-foreground">Authentication Required</h2>
                <p className="text-muted-foreground mb-6 max-w-sm">You need to be logged in to view this project.</p>
                <Link href="/login" className="bg-vertex-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    Log In
                </Link>
            </div>
        )
    }

    const isMember = workspace?.members?.includes(user.uid) || workspace?.adminId === user.uid;

    const statusStyles={
        active: "text-green-500 fill-green-500",
        archived: "text-gray-400 opacity-60",
        completed: "text-blue-500 fill-blue-500"
    }

    if (!workspace || !isMember) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-2xl font-semibold mb-3 text-foreground">Access Denied</h2>
                <p className="text-muted-foreground mb-6 max-w-sm">You are not a member of this workspace or don't have permission to view its projects.</p>
                <Link href="/workspaces" className="bg-vertex-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    My Workspaces
                </Link>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-2xl font-semibold mb-3 text-foreground">Project Not Found</h2>
                <p className="text-muted-foreground mb-6 max-w-sm">The project you are looking for doesn't exist within this workspace.</p>
                <Link href={`/workspaces/${workspaceSlug}`} className="bg-vertex-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    Back to Workspace
                </Link>
            </div>
        )
    }

    const projectColor = project?.color || '#6366f1';

    return (
        <div className="container mx-auto px-6 py-10 max-w-7xl min-h-screen">

            {/* Back link */}
            <motion.div initial={{ opacity: 1, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
                <Link href={`/workspaces/${workspaceSlug}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-vertex-primary transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to workspace
                </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 items-start">

                {/* Left column */}
                <div className="flex flex-col gap-5">

                    {/* Project header card */}
                    <motion.div
                        initial={{ opacity: 1, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="bg-card border border-border/50 rounded-xl overflow-hidden"
                    >
                        <div className="h-1 w-full" style={{ backgroundColor: projectColor }} />
                        <div className="p-6">
                            <div className="flex items-start gap-3 mb-5">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-base font-semibold shrink-0"
                                    style={{ backgroundColor: projectColor }}
                                >
                                    {project?.title?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h1 className="text-xl font-semibold text-foreground mb-2">{project?.title}</h1>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            {project?.status || 'unknown'}
                                        </span>
                                        {project?.deadline && (
                                            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                                <Calendar className="w-3 h-3" />
                                                Due: {project.deadline}
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border/50">
                                            <Clock className="w-3 h-3" />
                                            Created {project?.createdAt
                                                ? new Date(project.createdAt.seconds ? project.createdAt.toDate() : project.createdAt).toLocaleDateString()
                                                : 'recently'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-border/50 pt-5">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Description</p>
                                {project?.description ? (
                                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{project.description}</p>
                                ) : (
                                    <p className="text-sm text-muted-foreground/50 italic">No description provided.</p>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Tasks card */}
                    {!project.tasks.length && (
                        <motion.div
                            initial={{ opacity: 1, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-card border border-border/50 rounded-xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                                <div className="flex items-center gap-2">
                                    <CheckSquare className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm font-medium text-foreground">Tasks</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/50">0</span>
                                </div>
                                <CreateTaskDialog />
                            </div>
                            {!project.tasks.length && (
                            <div className="flex flex-col items-center justify-center py-14 px-6 gap-2.5">
                                <div className="w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center">
                                    <CheckSquare className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium text-foreground">No tasks yet</p>
                                <p className="text-xs text-muted-foreground text-center max-w-50">Add your first task to start tracking progress on this project.</p>
                            </div>
                            )}
                            {project.tasks.length && (
                                <></>
                            )}
                        </motion.div>
                    )}

                </div>

                {/* Right sidebar */}
                <div className="flex flex-col gap-4">

                    {/* Details */}
                    <motion.div
                        initial={{ opacity: 1, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-card border border-border/50 rounded-xl p-5"
                    >
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Details</p>
                        <div className="flex flex-col gap-2.5 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground flex items-center gap-2"><Circle className={`${statusStyles[project?.status]}`} size={16} />Status</span>
                                <span className="font-medium text-foreground capitalize">{project?.status || '—'}</span>
                            </div>
                            <div className="h-px bg-border/50" />
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" />Deadline</span>
                                <span className="text-foreground">{project?.deadline || '—'}</span>
                            </div>
                            <div className="h-px bg-border/50" />
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground flex items-center gap-2"><CheckSquare className="w-4 h-4" />Tasks</span>
                                <span className="text-foreground">0 total</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Progress */}
                    <motion.div
                        initial={{ opacity: 1, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card border border-border/50 rounded-xl p-5"
                    >
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Progress</p>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Completion</span>
                            <span className="text-sm font-medium text-foreground">0%</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full w-0 rounded-full transition-all" style={{ backgroundColor: projectColor }} />
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
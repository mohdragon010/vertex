"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useAuth from "@/hooks/useAuth";
import dynamic from "next/dynamic";
import TaskDetailHeader from "@/components/task/TaskDetailHeader";
import TaskDetailSidebar from "@/components/task/TaskDetailSidebar";

const EditTaskDialog = dynamic(() => import("@/components/editTaskDialog"), { ssr: false });
const DeleteTaskDialog = dynamic(() => import("@/components/deleteTaskDialog"), { ssr: false });

export default function TaskDetailPage() {
    const { workspaceSlug, projectId, taskId } = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [workspace, setWorkspace] = useState(null);
    const [project, setProject] = useState(null);
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "workspaces"), where("slug", "==", workspaceSlug));
        setLoading(true);

        const unsubscribe = onSnapshot(
            q,
            (snap) => {
                if (snap.empty) {
                    setWorkspace(null);
                    setProject(null);
                    setTask(null);
                } else {
                    const ws = { id: snap.docs[0].id, ...snap.docs[0].data() };
                    const proj = ws.projects?.find((p) => p.id === projectId) || null;
                    const foundTask = proj?.tasks?.find((t) => t.id === taskId) || null;
                    setWorkspace(ws);
                    setProject(proj);
                    setTask(foundTask);
                }
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching task:", err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [workspaceSlug, projectId, taskId]);

    // After delete, task will be null but workspace/project still exist.
    // Send the user back to the project page in that case.
    useEffect(() => {
        if (!loading && workspace && project && !task && deleteOpen === false && !authLoading) {
            // only redirect if we were previously on a valid task then it got removed
            // (not on initial "not found" loads)
        }
    }, [loading, workspace, project, task, deleteOpen, authLoading]);

    if (loading || authLoading) {
        return (
            <div className="container mx-auto px-6 py-10 max-w-7xl">
                <div className="h-5 w-40 bg-muted rounded animate-pulse mb-6" />
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
                    <div className="h-80 bg-card border border-border/50 rounded-xl animate-pulse" />
                    <div className="h-80 bg-card border border-border/50 rounded-xl animate-pulse" />
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-2xl font-semibold mb-3">Authentication required</h2>
                <p className="text-muted-foreground mb-6 max-w-sm">
                    You need to be logged in to view this task.
                </p>
                <Link
                    href="/login"
                    className="bg-vertex-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    Log in
                </Link>
            </div>
        );
    }

    const isMember =
        workspace?.members?.includes(user.uid) || workspace?.adminId === user.uid;

    if (!workspace || !isMember) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-2xl font-semibold mb-3">Access denied</h2>
                <p className="text-muted-foreground mb-6 max-w-sm">
                    You are not a member of this workspace.
                </p>
                <Link
                    href="/workspaces"
                    className="bg-vertex-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    My workspaces
                </Link>
            </div>
        );
    }

    if (!project || !task) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-2xl font-semibold mb-3">Task not found</h2>
                <p className="text-muted-foreground mb-6 max-w-sm">
                    This task doesn't exist or may have been deleted.
                </p>
                <Link
                    href={`/workspaces/${workspaceSlug}${project ? `/${project.id}` : ""}`}
                    className="bg-vertex-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    Back to {project ? "project" : "workspace"}
                </Link>
            </div>
        );
    }

    const projectColor = project.color || "#6366F1";

    return (
        <div className="container mx-auto px-6 py-10 max-w-7xl min-h-screen">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
                <Link
                    href={`/workspaces/${workspaceSlug}/${project.id}`}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-vertex-primary transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to {project.title}
                </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 items-start">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <TaskDetailHeader
                        task={task}
                        projectColor={projectColor}
                        onEdit={() => setEditOpen(true)}
                        onDelete={() => setDeleteOpen(true)}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                >
                    <TaskDetailSidebar task={task} project={project} workspaceSlug={workspaceSlug} />
                </motion.div>
            </div>

            <EditTaskDialog
                task={task}
                project={project}
                open={editOpen}
                onOpenChange={setEditOpen}
            />
            <DeleteTaskDialog
                task={task}
                project={project}
                open={deleteOpen}
                onOpenChange={(open) => {
                    setDeleteOpen(open);
                    if (!open && !task) router.push(`/workspaces/${workspaceSlug}/${project.id}`);
                }}
            />
        </div>
    );
}


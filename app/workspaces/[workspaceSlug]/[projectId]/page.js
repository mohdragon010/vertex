"use client"

import { useParams } from "next/navigation";
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Page() {
    const { workspaceSlug, projectId } = useParams();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState(null);
    const [workspace, setWorkspace] = useState(null);
    const [error, setError] = useState(null)


    useEffect(() => {
        const getProject = async () => {
            try{
                const workspaceCollectionRef = collection(db, "workspaces");
                const q = query(workspaceCollectionRef, where("slug", "==", workspaceSlug));


                setLoading(true)

                const unsubscribe = onSnapshot(q, querySnapshot => {
                    if(!querySnapshot.empty){
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
            }catch(err) {
                console.log(err)
            }
        };
        getProject()
    }, [])

    if (loading || authLoading) {
        return (
            <div className="container mx-auto px-6 py-12 max-w-7xl min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-vertex-primary animate-spin" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="container mx-auto px-6 py-12 max-w-7xl min-h-[70vh] flex flex-col items-center justify-center text-center">
                <h2 className="text-3xl font-bold mb-4 text-foreground">Authentication Required</h2>
                <p className="text-muted-foreground mb-8 max-w-md text-lg">You need to be logged in to view this project.</p>
                <Link href={`/login`} className="bg-vertex-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
                    Log In
                </Link>
            </div>
        )
    }

    const isMember = workspace?.members?.includes(user.uid) || workspace?.adminId === user.uid;

    if (!workspace || !isMember) {
        return (
            <div className="container mx-auto px-6 py-12 max-w-7xl min-h-[70vh] flex flex-col items-center justify-center text-center">
                <h2 className="text-3xl font-bold mb-4 text-foreground">Access Denied</h2>
                <p className="text-muted-foreground mb-8 max-w-md text-lg">You are not a member of this workspace or you do not have permission to view its projects.</p>
                <Link href={`/workspaces`} className="bg-vertex-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
                    My Workspaces
                </Link>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="container mx-auto px-6 py-12 max-w-7xl min-h-[70vh] flex flex-col items-center justify-center text-center">
                <h2 className="text-3xl font-bold mb-4 text-foreground">Project Not Found</h2>
                <p className="text-muted-foreground mb-8 max-w-md text-lg">The project you are looking for doesn't exist within this workspace.</p>
                <Link href={`/workspaces/${workspaceSlug}`} className="bg-vertex-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
                    Back to Workspace
                </Link>
            </div>
        )
    }

    return(
        <div className="container mx-auto px-6 py-12 max-w-7xl min-h-screen">
            <motion.div
                initial={{ opacity:0, x:-20 }}
                animate={{ opacity:1, x:0 }}
                className="mb-10"
            >
                <Link href={`/workspaces/${workspaceSlug}`} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-vertex-primary transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to workspace
                </Link>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm backdrop-blur-xl"
            >
                {/* Top banner with project color */}
                <div 
                    className="h-3 w-full" 
                    style={{ backgroundColor: project?.color || '#3b82f6' }} 
                />
                
                <div className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div 
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-sm"
                                    style={{ backgroundColor: project?.color || '#3b82f6' }}
                                >
                                    {project?.title?.charAt(0).toUpperCase()}
                                </div>
                                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                                    {project?.title}
                                </h1>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-6">
                                <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project?.status === 'active' ? '#10b981' : '#f59e0b' }} />
                                    <span className="capitalize font-medium text-foreground">{project?.status || 'Unknown'}</span>
                                </div>
                                
                                {project?.deadline && (
                                    <div className="flex items-center gap-1.5 text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20">
                                        <Calendar className="w-4 h-4" />
                                        <span className="font-medium flex items-center pt-px">Due: {project?.deadline}</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-1.5 bg-secondary/30 px-3 py-1.5 rounded-full border border-border/50">
                                    <Clock className="w-4 h-4 opacity-70" />
                                    <span className="flex items-center pt-px">
                                        Created {project?.createdAt ? new Date(project.createdAt.seconds ? project.createdAt.toDate() : project.createdAt).toLocaleDateString() : 'recently'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-none">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                            <FileText className="w-5 h-5 text-vertex-primary" />
                            Project Description
                        </h3>
                        <div className="bg-secondary/20 p-6 md:p-8 rounded-xl border border-border/50 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {project?.description ? (
                                <p className="text-[1.05rem]">{project.description}</p>
                            ) : (
                                <p className="italic opacity-60">No description provided for this project.</p>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )       
}
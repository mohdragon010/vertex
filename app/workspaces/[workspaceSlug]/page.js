"use client"

import useAuth from "@/hooks/useAuth"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Layout, Grid, Users, Calendar, ArrowLeft, Plus, Sparkles, MoreVertical, Edit, Trash2, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import WorkspaceMembersDropdownWrapper from "@/components/workspaceMembersDropdownWrapper"
import CreateProjectDialog from "@/components/createProjectDialog"
import EditProjectDialog from "@/components/editProjectDialog"
import DeleteProjectDialog from "@/components/deleteProjectDialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function WorkspacePage() {
    const param = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [createProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);
    const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);
    const [deleteProjectDialogOpen, setDeleteProjectDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    
    const handleEditProject = (e, project) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedProject(project);
        setEditProjectDialogOpen(true);
    }

    const handleDeleteProject = (e, project) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedProject(project);
        setDeleteProjectDialogOpen(true);
    }
    
    useEffect(() => {
        if (authLoading) return
        if (!user?.uid) { router.push("/login"); return }

        const collectionRef = collection(db, "workspaces");
        const q = query(collectionRef, where("slug", "==", param.workspaceSlug))

        setLoading(true);
        const unsubscribe = onSnapshot(q, (querySnap) => {
            if (!querySnap.empty) {
                setWorkspace({ ...querySnap.docs[0].data(), id: querySnap.docs[0].id })
            }
            setLoading(false);
        }, (err) => {
            console.error("Error fetching workspace:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user?.uid, authLoading, param.workspaceSlug])

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-12 max-w-7xl">
                <Skeleton className="h-10 w-32 mb-8" />
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <Skeleton className="w-40 h-40 rounded-[2.5rem]" />
                    <div className="space-y-4 flex-1 pt-4">
                        <Skeleton className="h-12 w-64" />
                        <Skeleton className="h-6 w-full max-w-lg" />
                    </div>
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
        <>
            <div className="container mx-auto px-6 py-12 max-w-7xl min-h-screen">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-10"
                >
                    <Link href="/workspaces" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-vertex-primary transition-colors group">
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to all Workspaces
                    </Link>
                </motion.div>

                <header className="flex flex-col lg:flex-row items-center lg:items-start gap-10 mb-20">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative group shrink-0"
                    >
                        {workspace.imageURL ? (
                            <div className="w-48 h-48 rounded-[3rem] overflow-hidden border-4 border-white dark:border-zinc-900 shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2">
                                <img
                                    src={workspace.imageURL}
                                    alt={workspace.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-48 h-48 bg-vertex-primary/10 rounded-[3rem] flex items-center justify-center border-4 border-white dark:border-zinc-900 shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2">
                                <Layout className="w-20 h-20 text-vertex-primary" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-vertex-primary/30 blur-3xl rounded-full scale-75 z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                    </motion.div>

                    <div className="flex-1 text-center lg:text-left pt-2">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-4">
                                <h1 className="text-6xl font-black tracking-tight uppercase selection:bg-vertex-primary selection:text-white">
                                    {workspace.name}
                                </h1>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] bg-muted/50 w-fit px-4 py-1.5 rounded-full border border-border/50 backdrop-blur-sm shadow-sm mt-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                                    Active
                                </div>
                            </div>
                            <p className="text-muted-foreground text-xl max-w-2xl mb-10 leading-relaxed font-medium">
                                {workspace.description || "Welcome to your collaborative workspace. Organize projects, manage teammates, and accelerate your productivity in this environment."}
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                                {[
                                    { icon: Grid, label: "Projects", value: workspace.projects?.length || 0, color: "vertex-primary" },
                                    { icon: Users, label: "Members", value: workspace.members?.length || 0, color: "vertex-primary" },
                                    { icon: Calendar, label: "Status", value: "Ready", color: "blue-500" }
                                ].map((stat, i) => {
                                    const StatCard = (
                                        <div key={i} className="flex items-center gap-4 bg-card/40 backdrop-blur-md border border-border/40 p-5 rounded-3xl shadow-sm min-w-40 hover:border-vertex-primary/30 transition-colors group/stat">
                                            <div className={`p-2.5 bg-${stat.color || 'vertex-primary'}/10 rounded-2xl text-${stat.color || 'vertex-primary'} group-hover/stat:scale-110 transition-transform`}>
                                                <stat.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                                                <p className="text-2xl font-black tracking-tight leading-none">{stat.value}</p>
                                            </div>
                                        </div>
                                    )
                                    if (stat.label === "Members") {
                                        return (
                                            <WorkspaceMembersDropdownWrapper key={i} members={workspace.members}>
                                                {StatCard}
                                            </WorkspaceMembersDropdownWrapper>
                                        )
                                    }
                                    return StatCard
                                })}
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="shrink-0 flex items-center gap-4"
                    >
                        {workspace.adminId === user?.uid && (
                            <>
                                <Link href={`/workspaces/${workspace.slug}/settings`}>
                                    <Button variant="outline" size="icon" className="rounded-2xl h-14 w-14 border-2 hover:bg-muted/50 transition-all active:scale-95 group" title="Workspace Settings">
                                        <Settings className="h-6 w-6 group-hover:rotate-45 transition-transform duration-300 text-vertex-primary" />
                                    </Button>
                                </Link>
                                <Link href={`/workspaces/${workspace.slug}/members`}>
                                    <Button variant="outline" className="rounded-2xl h-14 px-8 font-black text-lg border-2 hover:bg-muted/50 transition-all active:scale-95 group">
                                        <Users className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform duration-300 text-vertex-primary" />
                                        Manage Members
                                    </Button>
                                </Link>
                            </>
                        )}
                        <Button className="bg-vertex-primary hover:bg-vertex-primary/90 text-primary-foreground rounded-2xl h-14 px-8 font-black text-lg shadow-xl shadow-vertex-primary/20 transition-all active:scale-95 group" onClick={() => { setCreateProjectDialogOpen(true) }}>
                            <Plus className="mr-2 h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                            Create Project
                        </Button>
                    </motion.div>
                </header>

                <section className="mt-12">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-black flex items-center gap-4 tracking-tight">
                            <div className="p-2 bg-vertex-primary rounded-xl text-primary-foreground shadow-lg shadow-vertex-primary/20">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            Workspace Projects
                        </h2>
                    </div>

                    {(!workspace.projects || workspace.projects.length === 0) ? (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card/30 backdrop-blur-sm border-4 border-dashed border-border/60 rounded-[3rem] p-20 text-center hover:border-vertex-primary/30 transition-colors group/empty"
                        >
                            <div className="bg-background w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl border border-border group-hover/empty:scale-110 transition-transform duration-500">
                                <Grid className="w-10 h-10 text-muted-foreground group-hover/empty:text-vertex-primary transition-colors" />
                            </div>
                            <h3 className="text-3xl font-black mb-3 tracking-tight">No projects in this workspace</h3>
                            <p className="text-muted-foreground mb-10 text-lg max-w-md mx-auto leading-relaxed">Your projects will appear here once you create them. Ready to build something amazing?</p>
                            <Button className="bg-vertex-primary hover:bg-vertex-primary/90 rounded-2xl h-14 px-10 text-lg font-black shadow-lg shadow-vertex-primary/10" onClick={() => { setCreateProjectDialogOpen(true) }}>
                                Create First Project
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {workspace.projects.map((project, idx) => (
                                <motion.div
                                    key={project.id || idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group/proj"
                                >
                                    <Link href={`/workspaces/${param.workspaceSlug}/${project.id}`}>
                                        <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 h-full hover:shadow-2xl hover:shadow-vertex-primary/5 hover:border-vertex-primary/20 transition-all duration-500 cursor-pointer flex flex-col relative">
                                            <div className="absolute top-6 right-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-muted/50 border-0">
                                                            <MoreVertical className="h-5 w-5 text-muted-foreground" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-2xl border-border bg-card/95 backdrop-blur-md p-2 min-w-40 shadow-2xl">
                                                        <DropdownMenuItem 
                                                            className="rounded-xl flex items-center gap-3 p-3 focus:bg-vertex-primary/10 focus:text-vertex-primary cursor-pointer font-bold"
                                                            onClick={(e) => handleEditProject(e, project)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                            Edit Project
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="rounded-xl flex items-center gap-3 p-3 focus:bg-destructive/10 focus:text-destructive cursor-pointer font-bold"
                                                            onClick={(e) => handleDeleteProject(e, project)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete Project
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div className="flex justify-between items-start mb-6 pr-10">
                                                <div 
                                                    className="p-4 rounded-2xl transition-all duration-500 group-hover/proj:scale-110 group-hover/proj:rotate-3"
                                                    style={{ backgroundColor: `${project.color}20`, color: project.color }}
                                                >
                                                    <Grid className="w-7 h-7" />
                                                </div>
                                                <div 
                                                    className="text-[10px] font-black uppercase px-3 py-1.5 rounded-full border"
                                                    style={{ 
                                                        backgroundColor: project.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                                                        color: project.status === 'active' ? '#10B981' : '#6B7280',
                                                        borderColor: project.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)'
                                                    }}
                                                >
                                                    {project.status || 'Active'}
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-black mb-2 group-hover/proj:text-vertex-primary transition-colors" style={{ color: project.color }}>
                                                {project.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed mb-6">
                                                {project.description || "No description provided for this project."}
                                            </p>
                                            
                                            <div className="mt-auto flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                                <span>{project.tasks?.length || 0} Tasks</span>
                                                {project.deadline && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(project.deadline).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
            <CreateProjectDialog 
                open={createProjectDialogOpen} 
                setOpen={setCreateProjectDialogOpen} 
                workspaceId={workspace.id}
            />
            <EditProjectDialog
                open={editProjectDialogOpen}
                setOpen={setEditProjectDialogOpen}
                workspaceId={workspace.id}
                project={selectedProject}
                allProjects={workspace.projects || []}
            />
            <DeleteProjectDialog
                open={deleteProjectDialogOpen}
                setOpen={setDeleteProjectDialogOpen}
                workspaceId={workspace.id}
                project={selectedProject}
                allProjects={workspace.projects || []}
            />
        </>
    )
}
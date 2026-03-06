"use client"
import useAuth from "@/hooks/useAuth"
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react"
import { motion } from "framer-motion";
import { Plus, Layout, Grid, ArrowRight, Layers, PlusCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";


export default function Workspaces() {
    const { user } = useAuth();
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getWorkspaces = async () => {
            if (!user?.uid) {
                return
            }
            try {
                setLoading(true);
                const collectionRef = collection(db, 'workspaces');
                const q = query(collectionRef, where("members", "array-contains", user.uid));
                const snap = await getDocs(q);
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setWorkspaces(data)
            } catch (error) {
                console.error("Error fetching workspaces:", error);
            } finally {
                setLoading(false);
            }
        };

        getWorkspaces();
    }, [user?.uid])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    // Loading State
    if (loading) {
        return (
            <div className="container mx-auto px-6 py-12 max-w-7xl">
                <div className="flex justify-between items-end mb-10">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-11 w-40 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-72 w-full bg-card/50 border border-border rounded-[2rem] p-8 space-y-6">
                            <div className="flex justify-between">
                                <Skeleton className="h-14 w-14 rounded-2xl" />
                                <div className="flex -space-x-2">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // Empty state
    if (workspaces.length === 0) {
        return (
            <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[70vh] max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative mb-10"
                >
                    <div className="bg-vertex-primary/10 p-8 rounded-[2.5rem] relative z-10 overflow-hidden group">
                        <motion.div
                            animate={{
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Layers className="w-20 h-20 text-vertex-primary" />
                        </motion.div>

                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 bg-vertex-primary/20 w-12 h-12 rounded-full blur-xl" />
                        <div className="absolute -bottom-4 -left-4 bg-purple-500/20 w-16 h-16 rounded-full blur-xl" />
                    </div>

                    {/* Animated rings around the icon */}
                    <div className="absolute inset-0 -m-4 border border-vertex-primary/20 rounded-[3rem] animate-[ping_3s_linear_infinite] opacity-30" />
                    <div className="absolute inset-0 -m-8 border border-vertex-primary/10 rounded-[3.5rem] animate-[ping_4s_linear_infinite] opacity-20" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center max-w-lg"
                >
                    <h2 className="text-4xl font-extrabold tracking-tight mb-4 selection:bg-vertex-primary selection:text-white">
                        Your workspace is a blank canvas.
                    </h2>
                    <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
                        Create your first workspace to start organizing projects, collaborating with teammates, and bringing your ideas to life.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/workspaces/create" className="contents">
                            <Button className="bg-vertex-primary hover:bg-vertex-primary/90 text-primary-foreground h-14 px-8 rounded-2xl text-lg font-semibold shadow-xl shadow-vertex-primary/20 transition-all active:scale-[0.98] group">
                                <PlusCircle className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                                Create Workspace
                            </Button>
                        </Link>

                        <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 hover:bg-accent/50 text-lg font-medium transition-all">
                            Explore Templates
                        </Button>
                    </div>
                </motion.div>

                {/* Secondary help section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-border pt-12"
                >
                    {[
                        { icon: Sparkles, title: "Collaborate", desc: "Invite team members to work together in real-time." },
                        { icon: Layout, title: "Organize", desc: "Keep projects and discussions neatly categorized." },
                        { icon: Grid, title: "Integrate", desc: "Connect with your favorite tools and workflows." }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-3 px-4">
                            <div className="p-3 bg-muted rounded-xl">
                                <item.icon className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <h3 className="font-bold text-base">{item.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        )
        // workspaces cards
    } else {
        return (
            <div className="container mx-auto px-6 py-12 max-w-7xl min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12"
                >
                    <div>
                        <h1 className="text-5xl font-extrabold tracking-tighter mb-3 selection:bg-vertex-primary selection:text-white">
                            Workspaces
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-xl">
                            Access and manage all your collaborative environments in one place.
                        </p>
                    </div>
                    <Link href="/workspaces/create">
                        <Button className="bg-vertex-primary hover:bg-vertex-primary/90 text-primary-foreground h-12 px-6 rounded-xl shadow-lg shadow-vertex-primary/10 font-bold active:scale-95 transition-all">
                            <Plus className="mr-2 h-5 w-5" />
                            New Workspace
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {workspaces.map((workspace) => (
                        <motion.div key={workspace.id} variants={itemVariants}>
                            <Link href={`/workspaces/${workspace.id}`} className="block h-full">
                                <Card className="group h-full border-2 border-transparent hover:border-vertex-primary/20 bg-card hover:shadow-2xl hover:shadow-vertex-primary/5 transition-all duration-500 rounded-[2rem] overflow-hidden flex flex-col">
                                    <CardHeader className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="bg-vertex-primary/10 p-4 rounded-2xl group-hover:bg-vertex-primary group-hover:text-primary-foreground transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                                                <Layout className="w-7 h-7" />
                                            </div>
                                            <div className="flex -space-x-3">
                                                {[1, 2, 3].slice(0, workspace.members?.length || 0).map((i) => (
                                                    <div key={i} className="w-10 h-10 rounded-full border-4 border-card bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground ring-1 ring-border shadow-md capitalize">
                                                        {i === 1 ? user?.displayName?.charAt(0) || "U" : "U"}
                                                    </div>
                                                ))}
                                                {(workspace.members?.length || 0) > 3 && (
                                                    <div className="w-10 h-10 rounded-full border-4 border-card bg-accent flex items-center justify-center text-xs font-bold ring-1 ring-border shadow-md">
                                                        +{(workspace.members?.length || 0) - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <CardTitle className="text-2xl font-bold tracking-tight group-hover:text-vertex-primary transition-colors duration-300">
                                                {workspace.name}
                                            </CardTitle>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-widest bg-muted/30 w-fit px-3 py-1 rounded-full">
                                                <span className="w-1.5 h-1.5 rounded-full bg-vertex-primary animate-pulse" />
                                                Active Workspace
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground mt-4 line-clamp-2 text-base leading-relaxed">
                                            {workspace.description || "Streamline your team's productivity with this workspace."}
                                        </p>
                                    </CardHeader>
                                    <div className="mt-auto p-8 pt-0 flex items-center justify-between border-t border-border/10 bg-muted/5 group-hover:bg-vertex-primary/5 transition-colors">
                                        <span className="text-sm font-semibold group-hover:text-vertex-primary transition-colors">View details</span>
                                        <div className="p-2 rounded-full group-hover:bg-vertex-primary group-hover:text-primary-foreground transition-all duration-500 -translate-x-2 group-hover:translate-x-0">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        )
    }
}
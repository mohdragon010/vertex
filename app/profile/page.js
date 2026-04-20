"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import useAuth from "@/hooks/useAuth";
import useDashboardData from "@/hooks/useDashboardData";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileBio from "@/components/profile/ProfileBio";
import EditProfileDialog from "@/components/profile/EditProfileDialog";
import MyTasks from "@/components/dashboard/MyTasks";

const DAY_MS = 24 * 60 * 60 * 1000;

export default function ProfilePage() {
    const router = useRouter();
    const { user, userDoc, loading: authLoading } = useAuth();
    const { myTasks, workspaces, loading: dataLoading } = useDashboardData();
    const [editOpen, setEditOpen] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) router.push("/login");
    }, [authLoading, user, router]);

    const stats = useMemo(() => {
        const active = myTasks.filter((t) => t.status !== "done").length;
        const completed = myTasks.filter((t) => t.status === "done").length;
        const now = Date.now();
        const dueSoon = myTasks.filter((t) => {
            if (t.status === "done" || !t.deadline) return false;
            const diff = new Date(t.deadline).getTime() - now;
            return diff <= 3 * DAY_MS;
        }).length;
        return {
            workspacesCount: workspaces.length,
            activeCount: active,
            completedCount: completed,
            dueSoonCount: dueSoon,
        };
    }, [myTasks, workspaces]);

    if (authLoading || (user && dataLoading && !userDoc)) {
        return (
            <main className="container mx-auto px-6 py-10 max-w-5xl">
                <div className="h-60 bg-card border border-border/50 rounded-xl animate-pulse mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-20 bg-card border border-border/50 rounded-xl animate-pulse" />
                    ))}
                </div>
                <div className="h-40 bg-card border border-border/50 rounded-xl animate-pulse" />
            </main>
        );
    }

    if (!user) return null;

    return (
        <main className="container mx-auto px-6 py-10 max-w-5xl min-h-screen">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                <ProfileHeader
                    userDoc={userDoc}
                    user={user}
                    isOwnProfile
                    onEdit={() => setEditOpen(true)}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mb-4"
            >
                <ProfileStats {...stats} />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1"
                >
                    <ProfileBio
                        bio={userDoc?.bio}
                        isOwnProfile
                        onEdit={() => setEditOpen(true)}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="lg:col-span-2"
                >
                    <MyTasks tasks={myTasks} />
                </motion.div>
            </div>

            <EditProfileDialog
                userDoc={userDoc}
                user={user}
                open={editOpen}
                onOpenChange={setEditOpen}
            />
        </main>
    );
}


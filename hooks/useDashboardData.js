"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const toTime = (value) => {
    if (!value) return 0;
    if (typeof value === "string") return new Date(value).getTime() || 0;
    if (value?.toDate) return value.toDate().getTime();
    if (value?.seconds) return value.seconds * 1000;
    return 0;
};

export default function useDashboardData(userId) {
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setWorkspaces([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const q = query(
            collection(db, "workspaces"),
            where("members", "array-contains", userId)
        );

        const unsubscribe = onSnapshot(
            q,
            (snap) => {
                setWorkspaces(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
                setLoading(false);
            },
            (err) => {
                console.error("Dashboard fetch error:", err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId]);

    const data = useMemo(() => {
        const allTasks = [];
        const allProjects = [];

        workspaces.forEach((ws) => {
            (ws.projects || []).forEach((project) => {
                allProjects.push({
                    id: project.id,
                    title: project.title,
                    color: project.color,
                    status: project.status,
                    deadline: project.deadline,
                    createdAt: project.createdAt,
                    taskCount: project.tasks?.length || 0,
                    workspaceId: ws.id,
                    workspaceName: ws.name,
                    workspaceSlug: ws.slug,
                });

                (project.tasks || []).forEach((task) => {
                    allTasks.push({
                        ...task,
                        projectId: project.id,
                        projectTitle: project.title,
                        projectColor: project.color || "#6366F1",
                        workspaceId: ws.id,
                        workspaceName: ws.name,
                        workspaceSlug: ws.slug,
                    });
                });
            });
        });

        const myTasks = allTasks.filter((t) => t.assignedTo === userId);

        const now = Date.now();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        const counts = {
            total: myTasks.length,
            todo: myTasks.filter((t) => t.status === "todo").length,
            inProgress: myTasks.filter((t) => t.status === "in-progress").length,
            done: myTasks.filter((t) => t.status === "done").length,
            overdue: myTasks.filter(
                (t) =>
                    t.status !== "done" &&
                    t.deadline &&
                    new Date(t.deadline).getTime() < now
            ).length,
            dueSoon: myTasks.filter((t) => {
                if (t.status === "done" || !t.deadline) return false;
                const diff = new Date(t.deadline).getTime() - now;
                return diff >= 0 && diff <= sevenDays;
            }).length,
        };

        const upcomingDeadlines = myTasks
            .filter((t) => t.status !== "done" && t.deadline)
            .sort(
                (a, b) =>
                    new Date(a.deadline).getTime() -
                    new Date(b.deadline).getTime()
            )
            .slice(0, 5);

        const recentActivity = [...myTasks]
            .sort(
                (a, b) =>
                    toTime(b.updatedAt || b.createdAt) -
                    toTime(a.updatedAt || a.createdAt)
            )
            .slice(0, 6);

        return {
            workspaces,
            projects: allProjects,
            myTasks,
            counts,
            upcomingDeadlines,
            recentActivity,
        };
    }, [workspaces, userId]);

    return { ...data, loading };
}


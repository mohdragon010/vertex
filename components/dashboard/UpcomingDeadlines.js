"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";

const DAY_MS = 24 * 60 * 60 * 1000;

function relativeLabel(deadline) {
    const now = new Date();
    const due = new Date(deadline);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfDue = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
    const diffDays = Math.round((startOfDue - startOfToday) / DAY_MS);

    if (diffDays < 0) return { label: `${Math.abs(diffDays)}d overdue`, tone: "rose" };
    if (diffDays === 0) return { label: "Today", tone: "rose" };
    if (diffDays === 1) return { label: "Tomorrow", tone: "amber" };
    if (diffDays <= 7) return { label: `In ${diffDays} days`, tone: "amber" };
    return {
        label: due.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        tone: "muted",
    };
}

const TONE = {
    rose: "text-rose-500",
    amber: "text-amber-600 dark:text-amber-400",
    muted: "text-muted-foreground",
};

export default function UpcomingDeadlines({ tasks }) {
    return (
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Upcoming deadlines</h2>
            </div>

            {tasks.length === 0 ? (
                <div className="px-5 py-10 text-center">
                    <p className="text-sm font-medium">You're all clear</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        No deadlines on the horizon.
                    </p>
                </div>
            ) : (
                <ul className="divide-y divide-border/50">
                    {tasks.map((task) => {
                        const rel = relativeLabel(task.deadline);
                        return (
                            <li key={`${task.projectId}-${task.id}`}>
                                <Link
                                    href={`/workspaces/${task.workspaceSlug}/${task.projectId}`}
                                    className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/50 transition-colors"
                                >
                                    <div
                                        className="w-2 h-10 rounded-full shrink-0"
                                        style={{ backgroundColor: task.projectColor }}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm truncate">{task.title}</p>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                                            {task.projectTitle}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-medium shrink-0 ${TONE[rel.tone]}`}>
                                        {rel.label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}


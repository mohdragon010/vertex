"use client";

import Link from "next/link";
import { Activity, CheckCircle2, PlayCircle, Circle } from "lucide-react";

const STATUS_META = {
    todo: { icon: Circle, verb: "created", className: "text-muted-foreground" },
    "in-progress": { icon: PlayCircle, verb: "moved to in progress", className: "text-amber-500" },
    done: { icon: CheckCircle2, verb: "completed", className: "text-emerald-500" },
};

function toDate(value) {
    if (!value) return null;
    if (typeof value === "string") {
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
    }
    if (value?.toDate) return value.toDate();
    if (value?.seconds) return new Date(value.seconds * 1000);
    return null;
}

function timeAgo(date) {
    if (!date) return "";
    const diff = Date.now() - date.getTime();
    const mins = Math.round(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.round(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function RecentActivity({ tasks }) {
    return (
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Recent activity</h2>
            </div>

            {tasks.length === 0 ? (
                <div className="px-5 py-10 text-center">
                    <p className="text-sm font-medium">No activity yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Updates on your tasks will show up here.
                    </p>
                </div>
            ) : (
                <ul className="divide-y divide-border/50">
                    {tasks.map((task) => {
                        const meta = STATUS_META[task.status] || STATUS_META.todo;
                        const Icon = meta.icon;
                        const when = toDate(task.updatedAt || task.createdAt);
                        return (
                            <li key={`${task.projectId}-${task.id}`}>
                                <Link
                                    href={`/workspaces/${task.workspaceSlug}/${task.projectId}`}
                                    className="flex items-start gap-3 px-5 py-3 hover:bg-secondary/50 transition-colors"
                                >
                                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${meta.className}`} />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm truncate">
                                            <span className="text-muted-foreground">{meta.verb}: </span>
                                            <span className="font-medium">{task.title}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                                            {task.projectTitle} · {task.workspaceName}
                                        </p>
                                    </div>
                                    <span className="text-xs text-muted-foreground shrink-0">
                                        {timeAgo(when)}
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


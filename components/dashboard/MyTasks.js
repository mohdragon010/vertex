"use client";

import { useState } from "react";
import Link from "next/link";
import { Circle, PlayCircle, CheckCircle2, ArrowRight } from "lucide-react";

const STATUS_ICON = {
    todo: <Circle className="w-4 h-4 text-muted-foreground" />,
    "in-progress": <PlayCircle className="w-4 h-4 text-amber-500" />,
    done: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
};

const PRIORITY_DOT = {
    low: "bg-blue-500",
    medium: "bg-amber-500",
    high: "bg-rose-500",
};

const TABS = [
    { id: "active", label: "Active" },
    { id: "todo", label: "To do" },
    { id: "in-progress", label: "In progress" },
    { id: "done", label: "Done" },
];

function filterTasks(tasks, tab) {
    if (tab === "active") return tasks.filter((t) => t.status !== "done");
    return tasks.filter((t) => t.status === tab);
}

function TaskRow({ task }) {
    const isOverdue =
        task.deadline &&
        task.status !== "done" &&
        new Date(task.deadline).getTime() < Date.now();

    return (
        <Link
            href={`/workspaces/${task.workspaceSlug}/${task.projectId}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors group"
        >
            <span className="shrink-0">{STATUS_ICON[task.status] || STATUS_ICON.todo}</span>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p
                        className={`text-sm truncate ${
                            task.status === "done"
                                ? "line-through text-muted-foreground"
                                : "text-foreground"
                        }`}
                    >
                        {task.title}
                    </p>
                    <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            PRIORITY_DOT[task.priority] || PRIORITY_DOT.low
                        }`}
                        title={`${task.priority || "low"} priority`}
                    />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: task.projectColor }}
                    />
                    <span className="truncate">{task.projectTitle}</span>
                    <span>·</span>
                    <span className="truncate">{task.workspaceName}</span>
                </div>
            </div>

            {task.deadline && (
                <span
                    className={`text-xs shrink-0 ${
                        isOverdue ? "text-rose-500 font-medium" : "text-muted-foreground"
                    }`}
                >
                    {new Date(task.deadline).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                    })}
                </span>
            )}
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
    );
}

export default function MyTasks({ tasks }) {
    const [tab, setTab] = useState("active");
    const visible = filterTasks(tasks, tab);

    return (
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                <div>
                    <h2 className="text-sm font-semibold">My tasks</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Tasks assigned to you across all workspaces
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-1 px-3 pt-3 border-b border-border/50 overflow-x-auto">
                {TABS.map((t) => {
                    const active = tab === t.id;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`relative text-xs font-medium px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                                active
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {t.label}
                            {active && (
                                <span className="absolute left-3 right-3 -bottom-px h-0.5 bg-vertex-primary rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>

            {visible.length === 0 ? (
                <div className="py-14 text-center">
                    <p className="text-sm font-medium">Nothing here</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        No tasks match this filter.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-border/50">
                    {visible.slice(0, 8).map((task) => (
                        <TaskRow key={`${task.projectId}-${task.id}`} task={task} />
                    ))}
                </div>
            )}
        </div>
    );
}


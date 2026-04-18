"use client";

import { Calendar, CheckCircle2, Circle, PlayCircle, Pencil, Trash2 } from "lucide-react";

const STATUS_META = {
    todo: {
        icon: Circle,
        label: "To do",
        className: "bg-secondary text-muted-foreground border-border/50",
    },
    "in-progress": {
        icon: PlayCircle,
        label: "In progress",
        className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    done: {
        icon: CheckCircle2,
        label: "Done",
        className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
};

const PRIORITY_META = {
    low: { label: "Low", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
    medium: { label: "Medium", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
    high: { label: "High", className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
};

export default function TaskDetailHeader({
    task,
    projectColor,
    onEdit,
    onDelete,
}) {
    const status = STATUS_META[task.status] || STATUS_META.todo;
    const priority = PRIORITY_META[task.priority] || PRIORITY_META.low;
    const StatusIcon = status.icon;

    const isOverdue =
        task.deadline &&
        task.status !== "done" &&
        new Date(task.deadline).getTime() < Date.now();

    return (
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
            <div className="h-1 w-full" style={{ backgroundColor: projectColor }} />
            <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-start gap-3 min-w-0">
                        <StatusIcon className="w-6 h-6 mt-0.5 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                            <h1
                                className={`text-2xl font-semibold tracking-tight leading-snug ${
                                    task.status === "done"
                                        ? "line-through text-muted-foreground"
                                        : "text-foreground"
                                }`}
                            >
                                {task.title}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={onEdit}
                            className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-border/50 text-foreground hover:bg-secondary transition-colors"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                        </button>
                        <button
                            onClick={onDelete}
                            className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-border/50 text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span
                        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${status.className}`}
                    >
                        {status.label}
                    </span>
                    <span
                        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${priority.className}`}
                    >
                        {priority.label} priority
                    </span>
                    {task.deadline && (
                        <span
                            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
                                isOverdue
                                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                    : "bg-secondary text-muted-foreground border-border/50"
                            }`}
                        >
                            <Calendar className="w-3 h-3" />
                            {isOverdue ? "Overdue · " : "Due "}
                            {new Date(task.deadline).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                    )}
                    {task.tags?.filter(Boolean).map((tag, idx) => (
                        <span
                            key={idx}
                            className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border/50"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="border-t border-border/50 pt-5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Description
                    </p>
                    {task.description ? (
                        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                            {task.description}
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground/60 italic">
                            No description provided.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}


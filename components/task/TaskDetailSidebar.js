"use client";

import Link from "next/link";
import { Calendar, Clock, User, UserPlus, Folder } from "lucide-react";
import TaskAssignee from "./TaskAssignee";

function formatDate(value) {
    if (!value) return "—";
    let date;
    if (typeof value === "string") date = new Date(value);
    else if (value?.toDate) date = value.toDate();
    else if (value?.seconds) date = new Date(value.seconds * 1000);
    else return "—";

    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function Row({ icon: Icon, label, children }) {
    return (
        <div className="flex items-start justify-between gap-4 text-sm">
            <span className="text-muted-foreground flex items-center gap-2 shrink-0">
                <Icon className="w-4 h-4" />
                {label}
            </span>
            <div className="text-foreground text-right min-w-0">{children}</div>
        </div>
    );
}

export default function TaskDetailSidebar({ task, project, workspaceSlug }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="bg-card border border-border/50 rounded-xl p-5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                    Details
                </p>

                <div className="flex flex-col gap-3">
                    <Row icon={UserPlus} label="Assignee">
                        <TaskAssignee uid={task.assignedTo} />
                    </Row>
                    <div className="h-px bg-border/50" />

                    <Row icon={User} label="Created by">
                        <TaskAssignee uid={task.createdBy} />
                    </Row>
                    <div className="h-px bg-border/50" />

                    <Row icon={Calendar} label="Deadline">
                        <span>{task.deadline || "—"}</span>
                    </Row>
                    <div className="h-px bg-border/50" />

                    <Row icon={Clock} label="Created">
                        <span>{formatDate(task.createdAt)}</span>
                    </Row>

                    {task.updatedAt && task.updatedAt !== task.createdAt && (
                        <>
                            <div className="h-px bg-border/50" />
                            <Row icon={Clock} label="Updated">
                                <span>{formatDate(task.updatedAt)}</span>
                            </Row>
                        </>
                    )}
                </div>
            </div>

            <Link
                href={`/workspaces/${workspaceSlug}/${project.id}`}
                className="bg-card border border-border/50 rounded-xl p-5 flex items-start gap-3 hover:border-vertex-primary/40 hover:bg-secondary/40 transition-colors group"
            >
                <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-semibold shrink-0"
                    style={{ backgroundColor: project.color || "#6366F1" }}
                >
                    <Folder className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                        Project
                    </p>
                    <p className="text-sm font-medium truncate group-hover:text-vertex-primary transition-colors">
                        {project.title}
                    </p>
                </div>
            </Link>
        </div>
    );
}


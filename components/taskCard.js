"use client";

import { Clock, MoreHorizontal, MessageSquare, Paperclip, CheckCircle2, Circle, PlayCircle, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
const EditTaskDialog = dynamic(() => import("@/components/editTaskDialog"), { ssr: false });
const DeleteTaskDialog = dynamic(() => import("@/components/deleteTaskDialog"), { ssr: false });

export default function TaskCard({ task, project }) {
    const { workspaceSlug } = useParams();
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const taskHref = `/workspaces/${workspaceSlug}/${project.id}/${task.id}`;

    const priorityConfig = {
        low: { cls: "bg-blue-500/10 text-blue-500 border-blue-500/20", dot: "bg-blue-500" },
        medium: { cls: "bg-amber-500/10 text-amber-500 border-amber-500/20", dot: "bg-amber-500" },
        high: { cls: "bg-rose-500/10 text-rose-500 border-rose-500/20", dot: "bg-rose-500" },
    };

    const statusConfig = {
        todo: { icon: <Circle className="w-4 h-4 text-muted-foreground" />, label: "To Do" },
        "in-progress": { icon: <PlayCircle className="w-4 h-4 text-amber-500" />, label: "In Progress" },
        done: { icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, label: "Done" },
    };

    const priority = priorityConfig[task.priority] || priorityConfig.low;
    const status = statusConfig[task.status] || statusConfig.todo;
    const isDone = task.status === "done";
    const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !isDone;

    return (
        <>
            <div className={`
                group bg-card border rounded-xl p-4 transition-all duration-200
                hover:shadow-md hover:-translate-y-px
                ${isDone ? "border-border/30 opacity-70" : "border-border/50 hover:border-border"}
            `}>
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                        <button className="mt-0.5 shrink-0 hover:scale-110 transition-transform focus:outline-none" title={status.label}>
                            {status.icon}
                        </button>
                        <div className="min-w-0">
                            <Link
                                href={taskHref}
                                className={`text-sm font-medium leading-snug line-clamp-1 transition-colors block hover:underline underline-offset-2
                                    ${isDone ? "line-through text-muted-foreground" : "text-foreground group-hover:text-vertex-primary"}`}
                            >
                                {task.title}
                            </Link>
                            {task.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                                    {task.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-secondary text-muted-foreground transition-colors shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onSelect={() => setEditOpen(true)}>
                                <Pencil className="w-3.5 h-3.5" />
                                Edit Task
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                                onSelect={() => setDeleteOpen(true)}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete Task
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between mt-3.5 gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider ${priority.cls}`}>
                            <span className={`w-1 h-1 rounded-full ${priority.dot}`} />
                            {task.priority || "low"}
                        </span>
                        {task.tags?.filter(Boolean).map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border/50 text-[10px] font-medium tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground shrink-0">
                        {task.deadline && (
                            <div className={`flex items-center gap-1 ${isOverdue ? "text-rose-500 font-medium" : ""}`}>
                                <Clock className="w-3 h-3" />
                                <span>{new Date(task.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 opacity-50">
                            <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" />2</span>
                            <span className="flex items-center gap-0.5"><Paperclip className="w-3 h-3" />1</span>
                        </div>
                        {task.assignedTo && (
                            <div className="w-5 h-5 rounded-full bg-vertex-primary/20 border border-vertex-primary/30 flex items-center justify-center text-[9px] font-bold text-vertex-primary">
                                {task.assignedTo.substring(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <EditTaskDialog task={task} project={project} open={editOpen} onOpenChange={setEditOpen} />
            <DeleteTaskDialog task={task} project={project} open={deleteOpen} onOpenChange={setDeleteOpen} />
        </>
    );
}
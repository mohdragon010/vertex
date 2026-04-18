"use client";

import { CheckCircle2, CircleDashed, Clock, PlayCircle } from "lucide-react";

function StatCard({ icon: Icon, label, value, hint, tone }) {
    const toneMap = {
        default: "text-foreground",
        amber: "text-amber-600 dark:text-amber-400",
        emerald: "text-emerald-600 dark:text-emerald-500",
        rose: "text-rose-600 dark:text-rose-500",
    };
    return (
        <div className="bg-card border border-border/50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {label}
                </span>
                <Icon className={`w-4 h-4 ${toneMap[tone] || toneMap.default}`} />
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight">{value}</span>
                {hint && (
                    <span className="text-xs text-muted-foreground">{hint}</span>
                )}
            </div>
        </div>
    );
}

export default function DashboardStats({ counts }) {
    return (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
                icon={CircleDashed}
                label="Assigned"
                value={counts.total}
                hint={counts.total === 1 ? "task" : "tasks"}
            />
            <StatCard
                icon={PlayCircle}
                label="In progress"
                value={counts.inProgress}
                hint={`${counts.todo} to do`}
                tone="amber"
            />
            <StatCard
                icon={Clock}
                label="Due soon"
                value={counts.dueSoon}
                hint={counts.overdue ? `${counts.overdue} overdue` : "next 7 days"}
                tone={counts.overdue ? "rose" : "default"}
            />
            <StatCard
                icon={CheckCircle2}
                label="Completed"
                value={counts.done}
                hint={counts.total ? `${Math.round((counts.done / counts.total) * 100)}%` : "0%"}
                tone="emerald"
            />
        </section>
    );
}


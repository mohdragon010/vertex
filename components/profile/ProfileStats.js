"use client";

import { Layers, ListChecks, CheckCircle2, Clock } from "lucide-react";

function StatCard({ icon: Icon, label, value, tone = "default" }) {
    const toneCls = {
        default: "text-muted-foreground",
        primary: "text-vertex-primary",
        emerald: "text-emerald-500",
        amber: "text-amber-500",
    }[tone];

    return (
        <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Icon className={`w-3.5 h-3.5 ${toneCls}`} />
                <span>{label}</span>
            </div>
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
        </div>
    );
}

export default function ProfileStats({ workspacesCount, activeCount, completedCount, dueSoonCount }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={Layers} label="Workspaces" value={workspacesCount} tone="primary" />
            <StatCard icon={ListChecks} label="Active tasks" value={activeCount} />
            <StatCard icon={Clock} label="Due soon" value={dueSoonCount} tone="amber" />
            <StatCard icon={CheckCircle2} label="Completed" value={completedCount} tone="emerald" />
        </div>
    );
}


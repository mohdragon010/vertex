"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
};

const firstName = (userDoc, user) => {
    const name = userDoc?.name || user?.displayName || user?.email || "there";
    return String(name).split(" ")[0].split("@")[0];
};

export default function DashboardHeader({ userDoc, user }) {
    const today = new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    return (
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
                <p className="text-sm text-muted-foreground mb-1">{today}</p>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                    {greeting()}, {firstName(userDoc, user)}.
                </h1>
                <p className="text-muted-foreground mt-1.5 text-sm">
                    Here’s what needs your attention today.
                </p>
            </div>
            <Link
                href="/workspaces"
                className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2.5 rounded-lg bg-vertex-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
                <Plus className="w-4 h-4" />
                New Workspace
            </Link>
        </header>
    );
}


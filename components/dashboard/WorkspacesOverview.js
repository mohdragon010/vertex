"use client";

import Link from "next/link";
import { Layout, ArrowRight } from "lucide-react";

export default function WorkspacesOverview({ workspaces }) {
    return (
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <Layout className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold">Your workspaces</h2>
                </div>
                <Link
                    href="/workspaces"
                    className="text-xs font-medium text-muted-foreground hover:text-vertex-primary transition-colors inline-flex items-center gap-1"
                >
                    View all
                    <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            {workspaces.length === 0 ? (
                <div className="px-5 py-10 text-center">
                    <p className="text-sm font-medium">No workspaces yet</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-4">
                        Create a workspace to start organizing your work.
                    </p>
                    <Link
                        href="/workspaces/new"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-vertex-primary text-white text-xs font-medium hover:opacity-90 transition-opacity"
                    >
                        Create workspace
                    </Link>
                </div>
            ) : (
                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {workspaces.slice(0, 4).map((ws) => {
                        const projectCount = ws.projects?.length || 0;
                        const memberCount = ws.members?.length || 0;
                        return (
                            <Link
                                key={ws.id}
                                href={`/workspaces/${ws.slug}`}
                                className="group flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-vertex-primary/40 hover:bg-secondary/40 transition-colors"
                            >
                                <div className="w-9 h-9 rounded-lg bg-vertex-primary/10 flex items-center justify-center shrink-0 text-vertex-primary text-sm font-semibold uppercase">
                                    {ws.name?.charAt(0) || "W"}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate group-hover:text-vertex-primary transition-colors">
                                        {ws.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {projectCount} {projectCount === 1 ? "project" : "projects"}
                                        {" · "}
                                        {memberCount} {memberCount === 1 ? "member" : "members"}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}


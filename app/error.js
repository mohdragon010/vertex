"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw, Home } from "lucide-react";

export default function GlobalError({ error, reset }) {
    useEffect(() => {
        if (process.env.NODE_ENV !== "production") {
            console.error("App error boundary caught:", error);
        }
    }, [error]);

    return (
        <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6">
                <AlertTriangle className="w-7 h-7" />
            </div>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-rose-500 mb-3">
                Something went wrong
            </p>
            <h1 className="text-4xl font-black tracking-tight mb-3">
                We hit an unexpected issue.
            </h1>
            <p className="text-muted-foreground max-w-md mb-8">
                An error occurred while rendering this page. You can retry, or head back to the dashboard.
            </p>
            {error?.digest && (
                <p className="text-[11px] text-muted-foreground/70 mb-6 font-mono">
                    reference: {error.digest}
                </p>
            )}
            <div className="flex items-center gap-3 flex-wrap justify-center">
                <button
                    onClick={() => reset()}
                    className="inline-flex items-center gap-2 bg-vertex-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                    <RotateCw className="w-4 h-4" />
                    Try again
                </button>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 border border-border/60 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/50 transition-colors"
                >
                    <Home className="w-4 h-4" />
                    Dashboard
                </Link>
            </div>
        </main>
    );
}


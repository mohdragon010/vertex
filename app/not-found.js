import Link from "next/link";
import { Compass, Home } from "lucide-react";

export const metadata = {
    title: "Page not found",
    description: "The page you are looking for doesn't exist.",
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return (
        <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-vertex-primary/10 text-vertex-primary flex items-center justify-center mb-6">
                <Compass className="w-7 h-7" />
            </div>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-vertex-primary mb-3">
                Error 404
            </p>
            <h1 className="text-5xl font-black tracking-tight mb-3">
                This page drifted off.
            </h1>
            <p className="text-muted-foreground max-w-md mb-8">
                The link you followed may be broken, or the page may have moved. Let&apos;s get you back on track.
            </p>
            <div className="flex items-center gap-3 flex-wrap justify-center">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-vertex-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                    <Home className="w-4 h-4" />
                    Back to dashboard
                </Link>
                <Link
                    href="/workspaces"
                    className="inline-flex items-center gap-2 border border-border/60 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/50 transition-colors"
                >
                    My workspaces
                </Link>
            </div>
        </main>
    );
}


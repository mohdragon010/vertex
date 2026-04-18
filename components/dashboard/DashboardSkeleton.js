export default function DashboardSkeleton() {
    return (
        <div className="container mx-auto px-6 py-10 max-w-7xl">
            <div className="mb-8 space-y-2">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-9 w-72 bg-muted rounded animate-pulse" />
                <div className="h-4 w-64 bg-muted rounded animate-pulse" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-28 bg-card border border-border/50 rounded-xl animate-pulse"
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 h-96 bg-card border border-border/50 rounded-xl animate-pulse" />
                <div className="space-y-4">
                    <div className="h-64 bg-card border border-border/50 rounded-xl animate-pulse" />
                    <div className="h-40 bg-card border border-border/50 rounded-xl animate-pulse" />
                </div>
            </div>
        </div>
    );
}


export default function Loading() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-vertex-primary opacity-60 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-vertex-primary" />
                </span>
                Loading…
            </div>
        </div>
    );
}


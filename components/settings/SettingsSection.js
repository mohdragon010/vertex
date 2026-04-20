"use client";

export default function SettingsSection({ title, description, children }) {
    return (
        <section className="bg-card border border-border/50 rounded-xl p-6">
            <header className="mb-5">
                <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                {description && (
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                )}
            </header>
            <div>{children}</div>
        </section>
    );
}


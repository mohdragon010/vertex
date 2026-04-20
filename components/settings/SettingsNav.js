"use client";

import { motion } from "framer-motion";

export default function SettingsNav({ sections, active, onChange }) {
    return (
        <nav className="bg-card border border-border/50 rounded-xl p-2 lg:sticky lg:top-10">
            <ul className="flex flex-row lg:flex-col gap-1 overflow-x-auto">
                {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = active === section.key;
                    return (
                        <li key={section.key} className="shrink-0 lg:w-full">
                            <button
                                onClick={() => onChange(section.key)}
                                className={`relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                    isActive
                                        ? "bg-secondary text-foreground"
                                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                                }`}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="settings-nav-indicator"
                                        className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-vertex-primary hidden lg:block"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                                <Icon className="w-4 h-4" />
                                <span>{section.label}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}


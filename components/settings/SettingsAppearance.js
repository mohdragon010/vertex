"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "next-themes";
import SettingsSection from "./SettingsSection";

const OPTIONS = [
    { value: "light", label: "Light", icon: Sun, hint: "Bright and clean." },
    { value: "dark", label: "Dark", icon: Moon, hint: "Easy on the eyes." },
    { value: "system", label: "System", icon: Monitor, hint: "Match your OS." },
];

export default function SettingsAppearance() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <SettingsSection
            title="Appearance"
            description="Customize how Vertex looks on your device."
        >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isActive = mounted && theme === option.value;
                    return (
                        <button
                            key={option.value}
                            onClick={() => setTheme(option.value)}
                            className={`relative text-left p-4 rounded-xl border transition-colors ${
                                isActive
                                    ? "border-vertex-primary bg-vertex-primary/5"
                                    : "border-border/50 hover:bg-secondary/50"
                            }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                        isActive
                                            ? "bg-vertex-primary/10 text-vertex-primary"
                                            : "bg-secondary text-muted-foreground"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                </div>
                                {isActive && (
                                    <Check className="w-4 h-4 text-vertex-primary" />
                                )}
                            </div>
                            <p className="text-sm font-medium">{option.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{option.hint}</p>
                        </button>
                    );
                })}
            </div>
        </SettingsSection>
    );
}


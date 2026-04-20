"use client";

export default function SettingToggle({ label, description, checked, onChange, disabled }) {
    return (
        <label
            className={`flex items-start justify-between gap-4 py-4 ${
                disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            }`}
        >
            <div className="min-w-0">
                <p className="text-sm font-medium">{label}</p>
                {description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                )}
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => !disabled && onChange(!checked)}
                disabled={disabled}
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                    checked ? "bg-vertex-primary" : "bg-border"
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        checked ? "translate-x-4" : "translate-x-0.5"
                    }`}
                />
            </button>
        </label>
    );
}


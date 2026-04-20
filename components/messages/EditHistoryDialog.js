"use client";

import { History } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

function formatDateTime(value) {
    if (!value) return "";
    const date = value?.toDate?.() || (typeof value === "string" ? new Date(value) : null);
    if (!date || Number.isNaN(date.getTime())) return "";
    return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function EditHistoryDialog({ message, open, onOpenChange }) {
    const history = message?.editHistory || [];
    const current = message?.content || "";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <History className="w-4 h-4 text-muted-foreground" />
                        Edit history
                    </DialogTitle>
                    <DialogDescription>
                        {history.length === 0
                            ? "This message has not been edited."
                            : `${history.length} previous version${history.length === 1 ? "" : "s"}.`}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 max-h-[55vh] overflow-y-auto pr-1">
                    <div className="bg-vertex-primary/5 border border-vertex-primary/20 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-vertex-primary">
                                Current
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                                {formatDateTime(message?.updatedAt)}
                            </span>
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap wrap-break-word">
                            {current}
                        </p>
                    </div>

                    {[...history].reverse().map((entry, idx) => (
                        <div
                            key={idx}
                            className="bg-secondary/40 border border-border/50 rounded-xl p-3"
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Version {history.length - idx}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                    {formatDateTime(entry.editedAt)}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap wrap-break-word">
                                {entry.content}
                            </p>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}


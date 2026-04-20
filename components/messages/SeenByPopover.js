"use client";

import { Check, CheckCheck, Eye } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SeenByPopover({ seenBy = [], members = [], currentUserId }) {
    const others = seenBy.filter((uid) => uid !== currentUserId);
    const total = Math.max(0, (members?.length || 0) - 1); // exclude self from "total audience"
    const seen = others.length;

    const allSeen = total > 0 && seen >= total;
    const Icon = seen === 0 ? Check : allSeen ? CheckCheck : Eye;

    const seenMembers = members.filter((m) => others.includes(m.id));

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className={`inline-flex items-center gap-1 text-[11px] ${
                        allSeen ? "text-vertex-primary" : "text-muted-foreground"
                    } hover:underline`}
                    aria-label="Seen by"
                >
                    <Icon className="w-3 h-3" />
                    {seen === 0
                        ? "Sent"
                        : allSeen
                            ? "Seen by everyone"
                            : `Seen by ${seen}`}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 max-h-64 overflow-y-auto">
                <DropdownMenuLabel className="text-xs">
                    Seen by {seen} {seen === 1 ? "person" : "people"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {seenMembers.length === 0 ? (
                    <p className="px-2 py-2 text-xs text-muted-foreground">
                        No one has seen this yet.
                    </p>
                ) : (
                    <ul className="py-1">
                        {seenMembers.map((m) => (
                            <li
                                key={m.id}
                                className="flex items-center gap-2 px-2 py-1.5 text-xs"
                            >
                                <span className="w-6 h-6 rounded-full bg-vertex-primary/10 text-vertex-primary flex items-center justify-center text-[10px] font-semibold">
                                    {(m.name || m.email || "U").charAt(0).toUpperCase()}
                                </span>
                                <span className="min-w-0 truncate">
                                    {m.name || m.email || "Unknown"}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


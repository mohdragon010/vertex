"use client";

import { MoreHorizontal, Pencil, Trash2, History } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MessageActions({
    canEdit,
    canDelete,
    hasHistory,
    onEdit,
    onDelete,
    onShowHistory,
}) {
    if (!canEdit && !canDelete && !hasHistory) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 rounded-md hover:bg-secondary text-muted-foreground"
                    aria-label="Message actions"
                >
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
                {canEdit && (
                    <DropdownMenuItem onClick={onEdit} className="gap-2 text-sm">
                        <Pencil className="w-3.5 h-3.5" />
                        Edit message
                    </DropdownMenuItem>
                )}
                {hasHistory && (
                    <DropdownMenuItem onClick={onShowHistory} className="gap-2 text-sm">
                        <History className="w-3.5 h-3.5" />
                        View edit history
                    </DropdownMenuItem>
                )}
                {canDelete && (
                    <>
                        {(canEdit || hasHistory) && <DropdownMenuSeparator />}
                        <DropdownMenuItem
                            onClick={onDelete}
                            className="gap-2 text-sm text-rose-500 focus:text-rose-500"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete message
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


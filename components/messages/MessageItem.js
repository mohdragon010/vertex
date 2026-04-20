"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X, Loader2, Trash2 } from "lucide-react";
import { editMessage, deleteMessage, markMessageSeen } from "@/lib/messages";
import MessageActions from "./MessageActions";
import EditHistoryDialog from "./EditHistoryDialog";
import SeenByPopover from "./SeenByPopover";

function formatTime(value) {
    if (!value) return "";
    const date = value?.toDate?.() || null;
    if (!date) return "";
    return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function MessageItem({
    message,
    workspaceId,
    currentUserId,
    isAdmin,
    members,
    showHeader,
}) {
    const isOwn = message.authorId === currentUserId;
    const canEdit = isOwn && !message.deleted;
    const canDelete = (isOwn || isAdmin) && !message.deleted;
    const hasHistory = (message.editHistory?.length || 0) > 0;

    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(message.content || "");
    const [historyOpen, setHistoryOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const itemRef = useRef(null);

    useEffect(() => {
        if (isOwn || message.deleted) return;
        if (message.seenBy?.includes(currentUserId)) return;
        const el = itemRef.current;
        if (!el || typeof IntersectionObserver === "undefined") return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    markMessageSeen({ workspaceId, messageId: message.id, userId: currentUserId });
                    observer.disconnect();
                }
            },
            { threshold: 0.4 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [message.id, message.seenBy, isOwn, message.deleted, workspaceId, currentUserId]);

    const handleSaveEdit = async () => {
        setBusy(true); setError("");
        try {
            await editMessage({ workspaceId, messageId: message.id, userId: currentUserId, content: draft });
            setEditing(false);
        } catch (err) {
            setError(err.message || "Could not save");
        } finally { setBusy(false); }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this message? It cannot be undone.")) return;
        setBusy(true); setError("");
        try {
            await deleteMessage({ workspaceId, messageId: message.id, userId: currentUserId, isAdmin });
        } catch (err) {
            setError(err.message || "Could not delete");
        } finally { setBusy(false); }
    };

    const initial = (message.authorName || "U").charAt(0).toUpperCase();

    return (
        <div ref={itemRef} className={`group flex gap-3 px-4 ${showHeader ? "mt-4" : "mt-0.5"}`}>
            <div className="w-8 shrink-0 flex justify-center">
                {showHeader ? (
                    message.authorPhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={message.authorPhoto} alt={message.authorName} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-vertex-primary/10 text-vertex-primary flex items-center justify-center text-xs font-semibold">
                            {initial}
                        </div>
                    )
                ) : (
                    <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                        {formatTime(message.createdAt)}
                    </span>
                )}
            </div>

            <div className="flex-1 min-w-0">
                {showHeader && (
                    <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="text-sm font-semibold">{message.authorName}</span>
                        <span className="text-[11px] text-muted-foreground">{formatTime(message.createdAt)}</span>
                    </div>
                )}

                {message.deleted ? (
                    <p className="text-sm text-muted-foreground italic inline-flex items-center gap-1.5">
                        <Trash2 className="w-3 h-3" />
                        This message was deleted{message.deletedBy && message.deletedBy !== message.authorId ? " by an admin" : ""}.
                    </p>
                ) : editing ? (
                    <div className="flex flex-col gap-2 max-w-2xl">
                        <textarea
                            autoFocus
                            rows={2}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            className="w-full resize-y bg-secondary/40 border border-border/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-vertex-primary/40"
                        />
                        {error && <p className="text-xs text-rose-500">{error}</p>}
                        <div className="flex items-center gap-2">
                            <button onClick={handleSaveEdit} disabled={busy || !draft.trim()} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-vertex-primary text-primary-foreground disabled:opacity-50">
                                {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Save
                            </button>
                            <button onClick={() => { setEditing(false); setDraft(message.content); setError(""); }} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border border-border/50 hover:bg-secondary">
                                <X className="w-3 h-3" /> Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start gap-2">
                        <p className="text-sm text-foreground/95 whitespace-pre-wrap wrap-break-word max-w-2xl">
                            {message.content}
                            {message.edited && (
                                <button onClick={() => setHistoryOpen(true)} className="ml-1.5 text-[10px] text-muted-foreground hover:text-vertex-primary hover:underline align-middle">
                                    (edited)
                                </button>
                            )}
                        </p>
                        <MessageActions canEdit={canEdit} canDelete={canDelete} hasHistory={hasHistory} onEdit={() => setEditing(true)} onDelete={handleDelete} onShowHistory={() => setHistoryOpen(true)} />
                    </div>
                )}

                {error && !editing && <p className="text-xs text-rose-500 mt-1">{error}</p>}

                {isOwn && !message.deleted && !editing && (
                    <div className="mt-1">
                        <SeenByPopover seenBy={message.seenBy || []} members={members} currentUserId={currentUserId} />
                    </div>
                )}
            </div>

            <EditHistoryDialog message={message} open={historyOpen} onOpenChange={setHistoryOpen} />
        </div>
    );
}


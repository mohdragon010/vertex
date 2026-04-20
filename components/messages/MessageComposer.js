"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { sendMessage } from "@/lib/messages";

export default function MessageComposer({ workspaceId, author, disabled }) {
    const [content, setContent] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const textareaRef = useRef(null);

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }, [content]);

    const handleSend = async (e) => {
        e?.preventDefault?.();
        const value = content.trim();
        if (!value || sending) return;
        setSending(true);
        setError("");
        try {
            await sendMessage({ workspaceId, author, content: value });
            setContent("");
        } catch (err) {
            console.error(err);
            setError(err.message || "Could not send message");
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <form
            onSubmit={handleSend}
            className="border-t border-border/50 bg-card/60 backdrop-blur px-4 py-3"
        >
            {error && (
                <p className="text-xs text-rose-500 mb-2">{error}</p>
            )}
            <div className="flex items-end gap-2">
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    disabled={disabled || sending}
                    placeholder={disabled ? "You don't have access to this chat." : "Write a message…  (Enter to send, Shift + Enter for a new line)"}
                    className="flex-1 resize-none bg-secondary/40 border border-border/50 rounded-xl px-3 py-2 text-sm outline-none focus:border-vertex-primary/40 focus:ring-2 focus:ring-vertex-primary/10 disabled:opacity-60 disabled:cursor-not-allowed max-h-40"
                />
                <button
                    type="submit"
                    disabled={!content.trim() || sending || disabled}
                    className="shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-xl bg-vertex-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    aria-label="Send message"
                >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
            </div>
        </form>
    );
}


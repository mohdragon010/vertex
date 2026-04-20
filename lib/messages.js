"use client";

import { db } from "@/lib/firebase";
import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    getDoc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

/**
 * Messages data model
 *
 * workspaces/{workspaceId}/messages/{messageId}
 *   {
 *     authorId, authorName, authorPhoto,
 *     content,
 *     createdAt, updatedAt,
 *     edited: boolean,
 *     editHistory: [{ content, editedAt }],
 *     deleted: boolean,
 *     deletedBy: uid | null,
 *     deletedAt: timestamp | null,
 *     seenBy: [uid, ...],
 *   }
 */

function messagesRef(workspaceId) {
    return collection(db, "workspaces", workspaceId, "messages");
}

function messageRef(workspaceId, messageId) {
    return doc(db, "workspaces", workspaceId, "messages", messageId);
}

export async function sendMessage({ workspaceId, author, content }) {
    const trimmed = (content || "").trim();
    if (!workspaceId) throw new Error("workspaceId is required");
    if (!author?.uid) throw new Error("author is required");
    if (!trimmed) throw new Error("Message cannot be empty");

    return addDoc(messagesRef(workspaceId), {
        authorId: author.uid,
        authorName: author.name || author.displayName || author.email || "Unknown",
        authorPhoto: author.photoURL || "",
        content: trimmed,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        edited: false,
        editHistory: [],
        deleted: false,
        deletedBy: null,
        deletedAt: null,
        seenBy: [author.uid],
    });
}

export async function editMessage({ workspaceId, messageId, userId, content }) {
    const trimmed = (content || "").trim();
    if (!trimmed) throw new Error("Message cannot be empty");

    const ref = messageRef(workspaceId, messageId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Message not found");
    const data = snap.data();

    if (data.deleted) throw new Error("Cannot edit a deleted message");
    if (data.authorId !== userId) {
        const err = new Error("Only the author can edit this message.");
        err.code = "message/forbidden";
        throw err;
    }
    if (data.content === trimmed) return;

    const historyEntry = {
        content: data.content,
        editedAt: new Date().toISOString(),
    };

    await updateDoc(ref, {
        content: trimmed,
        edited: true,
        updatedAt: serverTimestamp(),
        editHistory: arrayUnion(historyEntry),
    });
}

export async function deleteMessage({ workspaceId, messageId, userId, isAdmin }) {
    const ref = messageRef(workspaceId, messageId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Message not found");
    const data = snap.data();
    if (data.deleted) return;

    const isAuthor = data.authorId === userId;
    if (!isAuthor && !isAdmin) {
        const err = new Error("You don't have permission to delete this message.");
        err.code = "message/forbidden";
        throw err;
    }

    await updateDoc(ref, {
        deleted: true,
        deletedBy: userId,
        deletedAt: serverTimestamp(),
        content: "",
        updatedAt: serverTimestamp(),
    });
}

export async function markMessageSeen({ workspaceId, messageId, userId }) {
    if (!workspaceId || !messageId || !userId) return;
    try {
        await updateDoc(messageRef(workspaceId, messageId), {
            seenBy: arrayUnion(userId),
        });
    } catch (err) {
        // Swallow silently — seen receipts are best-effort.
        if (process.env.NODE_ENV !== "production") console.warn("markMessageSeen:", err);
    }
}


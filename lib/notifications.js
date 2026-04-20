"use client";

import { db } from "@/lib/firebase";
import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where,
    writeBatch,
} from "firebase/firestore";

/**
 * Notifications / Invitations data model
 *
 * invitations/{id}
 *   { workspaceId, workspaceSlug, workspaceName, workspaceImage,
 *     fromUserId, fromUserName, fromUserEmail,
 *     toUserId, toUserEmail,
 *     status: "pending" | "accepted" | "declined",
 *     createdAt, respondedAt }
 *
 * notifications/{id}
 *   { userId, type, title, message, link, meta, read, createdAt }
 */

export async function createNotification({
    userId,
    type = "info",
    title,
    message = "",
    link = "",
    meta = {},
}) {
    if (!userId || !title) throw new Error("createNotification: userId and title are required");
    return addDoc(collection(db, "notifications"), {
        userId,
        type,
        title,
        message,
        link,
        meta,
        read: false,
        createdAt: serverTimestamp(),
    });
}

export async function markNotificationRead(notificationId) {
    if (!notificationId) return;
    await updateDoc(doc(db, "notifications", notificationId), { read: true });
}

export async function markAllNotificationsRead(userId) {
    if (!userId) return;
    const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        where("read", "==", false)
    );
    const snap = await getDocs(q);
    if (snap.empty) return;
    const batch = writeBatch(db);
    snap.forEach((d) => batch.update(d.ref, { read: true }));
    await batch.commit();
}

export async function createInvitation({ workspace, fromUser, toUser }) {
    // Avoid creating duplicates: check for an existing pending invite for this pair.
    const existing = await getDocs(
        query(
            collection(db, "invitations"),
            where("workspaceId", "==", workspace.id),
            where("toUserId", "==", toUser.id),
            where("status", "==", "pending")
        )
    );
    if (!existing.empty) {
        const err = new Error("An invitation is already pending for this user.");
        err.code = "invite/duplicate";
        throw err;
    }

    const inviteRef = await addDoc(collection(db, "invitations"), {
        workspaceId: workspace.id,
        workspaceSlug: workspace.slug,
        workspaceName: workspace.name || workspace.title || "",
        workspaceImage: workspace.imageURL || "",
        fromUserId: fromUser.uid,
        fromUserName: fromUser.displayName || fromUser.name || fromUser.email || "",
        fromUserEmail: fromUser.email || "",
        toUserId: toUser.id,
        toUserEmail: toUser.email,
        status: "pending",
        createdAt: serverTimestamp(),
        respondedAt: null,
    });

    await createNotification({
        userId: toUser.id,
        type: "invite",
        title: `${fromUser.displayName || fromUser.name || "Someone"} invited you to a workspace`,
        message: workspace.name || workspace.title || "",
        link: "/notifications",
        meta: { inviteId: inviteRef.id, workspaceId: workspace.id, workspaceSlug: workspace.slug },
    });

    return inviteRef.id;
}

export async function respondToInvitation({ inviteId, accept, userId }) {
    if (!inviteId) throw new Error("inviteId is required");
    const inviteRef = doc(db, "invitations", inviteId);
    const inviteSnap = await getDoc(inviteRef);
    if (!inviteSnap.exists()) throw new Error("Invitation not found");
    const invite = inviteSnap.data();
    if (invite.status !== "pending") throw new Error("Invitation already responded to");
    if (invite.toUserId !== userId) throw new Error("Not authorized to respond to this invitation");

    await updateDoc(inviteRef, {
        status: accept ? "accepted" : "declined",
        respondedAt: serverTimestamp(),
    });

    if (accept) {
        await updateDoc(doc(db, "workspaces", invite.workspaceId), {
            members: arrayUnion(userId),
        });
    }

    // Notify the inviter
    await createNotification({
        userId: invite.fromUserId,
        type: accept ? "invite-accepted" : "invite-declined",
        title: accept ? "Invitation accepted" : "Invitation declined",
        message: `${invite.toUserEmail} ${accept ? "joined" : "declined"} ${invite.workspaceName || "your workspace"}`,
        link: accept ? `/workspaces/${invite.workspaceSlug}` : "",
        meta: { workspaceId: invite.workspaceId, workspaceSlug: invite.workspaceSlug },
    });

    return invite;
}


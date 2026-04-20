"use client";

import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SettingsSection from "./SettingsSection";
import SettingToggle from "./SettingToggle";

const DEFAULTS = {
    notifyInApp: true,
    notifyEmail: false,
    notifyInvites: true,
    notifyAssignments: true,
    notifyMentions: true,
};

export default function SettingsNotifications({ userDoc, user }) {
    const [saving, setSaving] = useState(null);

    const prefs = { ...DEFAULTS, ...(userDoc?.prefs || {}) };

    const setPref = async (key, value) => {
        if (!user?.uid) return;
        setSaving(key);
        try {
            await setDoc(
                doc(db, "users", user.uid),
                { prefs: { ...prefs, [key]: value } },
                { merge: true }
            );
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(null);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <SettingsSection
                title="Channels"
                description="Where you want to receive notifications."
            >
                <div className="divide-y divide-border/50">
                    <SettingToggle
                        label="In-app notifications"
                        description="Show notifications in the bell and on the notifications page."
                        checked={prefs.notifyInApp}
                        disabled={saving === "notifyInApp"}
                        onChange={(v) => setPref("notifyInApp", v)}
                    />
                    <SettingToggle
                        label="Email notifications"
                        description="Send important updates to your email (coming soon)."
                        checked={prefs.notifyEmail}
                        disabled={saving === "notifyEmail"}
                        onChange={(v) => setPref("notifyEmail", v)}
                    />
                </div>
            </SettingsSection>

            <SettingsSection
                title="What to notify me about"
                description="Pick the events that matter to you."
            >
                <div className="divide-y divide-border/50">
                    <SettingToggle
                        label="Workspace invitations"
                        description="When someone invites you to join a workspace."
                        checked={prefs.notifyInvites}
                        disabled={saving === "notifyInvites"}
                        onChange={(v) => setPref("notifyInvites", v)}
                    />
                    <SettingToggle
                        label="Task assignments"
                        description="When a task is assigned to you."
                        checked={prefs.notifyAssignments}
                        disabled={saving === "notifyAssignments"}
                        onChange={(v) => setPref("notifyAssignments", v)}
                    />
                    <SettingToggle
                        label="Mentions"
                        description="When someone @mentions you in a comment."
                        checked={prefs.notifyMentions}
                        disabled={saving === "notifyMentions"}
                        onChange={(v) => setPref("notifyMentions", v)}
                    />
                </div>
            </SettingsSection>
        </div>
    );
}


"use client";

import { useEffect, useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Loader2, Check } from "lucide-react";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SettingsSection from "./SettingsSection";

const MAX_BIO = 280;

export default function SettingsAccount({ userDoc, user }) {
    const [form, setForm] = useState({ name: "", title: "", bio: "", photoURL: "" });
    const [status, setStatus] = useState("idle"); // idle | saving | saved | error
    const [error, setError] = useState("");

    useEffect(() => {
        setForm({
            name: userDoc?.name || user?.displayName || "",
            title: userDoc?.title || "",
            bio: userDoc?.bio || "",
            photoURL: userDoc?.photoURL || "",
        });
    }, [userDoc, user]);

    const update = (field) => (e) => {
        const value = e.target.value;
        if (field === "bio" && value.length > MAX_BIO) return;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!user?.uid || !form.name.trim()) {
            setError("Name is required.");
            return;
        }
        setStatus("saving");
        setError("");
        try {
            await setDoc(
                doc(db, "users", user.uid),
                {
                    name: form.name.trim(),
                    title: form.title.trim(),
                    bio: form.bio.trim(),
                    photoURL: form.photoURL.trim(),
                    updatedAt: serverTimestamp(),
                },
                { merge: true }
            );
            setStatus("saved");
            setTimeout(() => setStatus("idle"), 2000);
        } catch (err) {
            console.error(err);
            setStatus("error");
            setError("Failed to save. Please try again.");
        }
    };

    return (
        <SettingsSection title="Account" description="Update your personal information.">
            <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="s-name">Name</Label>
                        <Input id="s-name" value={form.name} onChange={update("name")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="s-email">Email</Label>
                        <Input id="s-email" value={user?.email || ""} readOnly disabled />
                        <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="s-title">Title / Role</Label>
                    <Input id="s-title" value={form.title} onChange={update("title")} placeholder="e.g. Designer" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="s-photo">Avatar URL</Label>
                    <Input id="s-photo" type="url" value={form.photoURL} onChange={update("photoURL")} placeholder="https://..." />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="s-bio">Bio</Label>
                    <Textarea id="s-bio" rows={3} value={form.bio} onChange={update("bio")} placeholder="A short description..." />
                    <p className="text-xs text-muted-foreground text-right">
                        {form.bio.length}/{MAX_BIO}
                    </p>
                </div>

                {error && <p className="text-sm text-rose-500">{error}</p>}

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/50">
                    {status === "saved" && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-500">
                            <Check className="w-3.5 h-3.5" /> Saved
                        </span>
                    )}
                    <Button type="submit" disabled={status === "saving"}>
                        {status === "saving" && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
                        Save changes
                    </Button>
                </div>
            </form>
        </SettingsSection>
    );
}


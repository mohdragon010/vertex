"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const MAX_BIO = 280;

export default function EditProfileDialog({ userDoc, user, open, onOpenChange }) {
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        bio: "",
        photoURL: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return;
        setFormData({
            name: userDoc?.name || user?.displayName || "",
            title: userDoc?.title || "",
            bio: userDoc?.bio || "",
            photoURL: userDoc?.photoURL || "",
        });
        setError("");
    }, [open, userDoc, user]);

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        if (field === "bio" && value.length > MAX_BIO) return;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.uid) return;
        if (!formData.name.trim()) {
            setError("Name is required.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await setDoc(
                doc(db, "users", user.uid),
                {
                    name: formData.name.trim(),
                    title: formData.title.trim(),
                    bio: formData.bio.trim(),
                    photoURL: formData.photoURL.trim(),
                    updatedAt: serverTimestamp(),
                },
                { merge: true }
            );
            onOpenChange(false);
        } catch (err) {
            console.error(err);
            setError("Failed to save. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        This information is visible to your teammates.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={handleChange("name")}
                            placeholder="Your full name"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Title / Role</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={handleChange("title")}
                            placeholder="e.g. Frontend Engineer"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="photoURL">Avatar URL</Label>
                        <Input
                            id="photoURL"
                            type="url"
                            value={formData.photoURL}
                            onChange={handleChange("photoURL")}
                            placeholder="https://..."
                            disabled={loading}
                        />
                        <p className="text-xs text-muted-foreground">
                            Paste a direct link to an image. Leave empty to use your initial.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            rows={3}
                            value={formData.bio}
                            onChange={handleChange("bio")}
                            placeholder="A short description about yourself..."
                            disabled={loading}
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {formData.bio.length}/{MAX_BIO}
                        </p>
                    </div>

                    {error && <p className="text-sm text-rose-500">{error}</p>}

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
                            Save changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}


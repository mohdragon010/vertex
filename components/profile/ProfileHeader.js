"use client";

import { Pencil, Mail, Briefcase, Calendar } from "lucide-react";

function formatDate(value) {
    if (!value) return null;
    const date = value?.toDate?.() || (value?.seconds ? new Date(value.seconds * 1000) : null);
    if (!date) return null;
    return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export default function ProfileHeader({ userDoc, user, isOwnProfile, onEdit }) {
    const name = userDoc?.name || user?.displayName || user?.email || "User";
    const email = userDoc?.email || user?.email || "";
    const title = userDoc?.title || "";
    const photoURL = userDoc?.photoURL || "";
    const initial = (name || email || "U").charAt(0).toUpperCase();
    const joined = formatDate(userDoc?.createdAt);

    return (
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-vertex-primary/10 via-secondary to-secondary/40" />
            <div className="px-6 pb-6 -mt-12">
                <div className="flex items-end justify-between gap-4 mb-5">
                    <div className="w-24 h-24 rounded-2xl border-4 border-card bg-vertex-primary/10 text-vertex-primary flex items-center justify-center text-3xl font-semibold overflow-hidden">
                        {photoURL ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={photoURL}
                                alt={name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            initial
                        )}
                    </div>

                    {isOwnProfile && (
                        <button
                            onClick={onEdit}
                            className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-border/50 text-foreground hover:bg-secondary transition-colors"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit profile
                        </button>
                    )}
                </div>

                <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
                {title && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        {title}
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-4 text-sm text-muted-foreground">
                    {email && (
                        <span className="inline-flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" />
                            {email}
                        </span>
                    )}
                    {joined && (
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            Joined {joined}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}


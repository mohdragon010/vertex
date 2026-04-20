"use client";

import { FileText } from "lucide-react";

export default function ProfileBio({ bio, isOwnProfile, onEdit }) {
    return (
        <div className="bg-card border border-border/50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    About
                </p>
            </div>

            {bio ? (
                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {bio}
                </p>
            ) : (
                <p className="text-sm text-muted-foreground/70 italic">
                    {isOwnProfile ? (
                        <>
                            Tell your team a bit about yourself.{" "}
                            <button
                                onClick={onEdit}
                                className="not-italic text-vertex-primary hover:underline font-medium"
                            >
                                Add a bio
                            </button>
                        </>
                    ) : (
                        "This user hasn't added a bio yet."
                    )}
                </p>
            )}
        </div>
    );
}


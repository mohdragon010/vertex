"use client";

import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState } from "react";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";

export default function DeleteTaskDialog({ task, project, open, onOpenChange }) {
    const { workspaceSlug, projectId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async () => {
        setError("");
        setIsLoading(true);
        try {
            const workspaceQuery = query(collection(db, "workspaces"), where("slug", "==", workspaceSlug));
            const workspaceSnap  = await getDocs(workspaceQuery);
            if (workspaceSnap.empty) throw new Error("Workspace not found");

            const workspaceDoc  = workspaceSnap.docs[0];
            const workspaceData = workspaceDoc.data();
            const workspaceRef  = doc(db, "workspaces", workspaceDoc.id);

            const updatedProjects = workspaceData.projects.map((proj) => {
                if (proj.id !== projectId) return proj;
                return {
                    ...proj,
                    tasks: (proj.tasks || []).filter((t) => t.id !== task.id),
                };
            });

            await updateDoc(workspaceRef, { projects: updatedProjects });
            onOpenChange(false);
        } catch (err) {
            console.error("Error deleting task:", err);
            setError(err.message || "Failed to delete task");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                        </div>
                        <DialogTitle>Delete Task</DialogTitle>
                    </div>
                    <DialogDescription className="text-sm text-muted-foreground leading-relaxed pl-12">
                        Are you sure you want to delete{" "}
                        <span className="font-medium text-foreground">"{task.title}"</span>?
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mt-2">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-md text-sm font-medium border border-border/50 hover:bg-secondary transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md font-medium text-sm transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />
                        }
                        Delete
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
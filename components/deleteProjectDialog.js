"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { Button } from "./ui/button"
import { useState } from "react"
import { AlertTriangle } from "lucide-react"

export default function DeleteProjectDialog({ open, setOpen, workspaceId, project, allProjects }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)

    const deleteProject = async () => {
        setLoading(true)
        setError(null)

        try {
            const docRef = doc(db, "workspaces", workspaceId)
            
            const updatedProjects = allProjects.filter(p => p.id !== project.id)

            await updateDoc(docRef, {
                projects: updatedProjects
            })

            console.log("Project deleted successfully")
            setOpen(false)
        } catch (err) {
            console.error("Error deleting project:", err)
            setError(err.message || "Failed to delete project")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md bg-background border-border">
                <DialogHeader>
                    <div className="flex items-center gap-3 text-destructive mb-2">
                        <div className="p-2 bg-destructive/10 rounded-full">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-xl font-bold italic uppercase tracking-tight">Delete Project</DialogTitle>
                    </div>
                    <DialogDescription className="text-muted-foreground text-base">
                        Are you sure you want to delete <span className="font-bold text-foreground">"{project?.title}"</span>? 
                        This action cannot be undone and all associated tasks will be lost forever.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20 mt-2">
                        {error}
                    </div>
                )}

                <DialogFooter className="gap-2 mt-6">
                    <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading} className="rounded-xl">
                        Keep Project
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={deleteProject}
                        disabled={loading}
                        className="rounded-xl font-bold shadow-lg shadow-destructive/20"
                    >
                        {loading ? "Deleting..." : "Yes, Delete Project"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

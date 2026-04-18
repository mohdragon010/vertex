"use client";

import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";

export default function EditTaskDialog({ task, project, open, onOpenChange }) {
    const { user } = useAuth();
    const { workspaceSlug, projectId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title:       task.title       || "",
        description: task.description || "",
        status:      task.status      || "todo",
        priority:    task.priority    || "low",
        assignedTo:  task.assignedTo  || "",
        tags:        task.tags        || [],
        deadline:    task.deadline    || "",
    });

    // Sync if task prop changes (e.g. parent re-renders)
    useEffect(() => {
        setFormData({
            title:       task.title       || "",
            description: task.description || "",
            status:      task.status      || "todo",
            priority:    task.priority    || "low",
            assignedTo:  task.assignedTo  || "",
            tags:        task.tags        || [],
            deadline:    task.deadline    || "",
        });
    }, [task]);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                const updatedTasks = (proj.tasks || []).map((t) => {
                    if (t.id !== task.id) return t;
                    return {
                        ...t,
                        ...formData,
                        tags:      formData.tags.filter(tag => tag.trim() !== ""),
                        updatedAt: new Date().toISOString(),
                    };
                });
                return { ...proj, tasks: updatedTasks };
            });

            await updateDoc(workspaceRef, { projects: updatedProjects });
            onOpenChange(false);
        } catch (err) {
            console.error("Error updating task:", err);
            setError(err.message || "Failed to update task");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogDescription>Update the details for this task.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    {error && (
                        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="edit-title">Task Title</Label>
                        <Input
                            id="edit-title"
                            placeholder="Enter task title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                            id="edit-description"
                            placeholder="Enter task description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                                <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todo">To Do</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="done">Done</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select value={formData.priority} onValueChange={(val) => setFormData({ ...formData, priority: val })}>
                                <SelectTrigger><SelectValue placeholder="Select Priority" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-deadline">Deadline</Label>
                        <Input
                            id="edit-deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                        <Input
                            id="edit-tags"
                            placeholder="e.g. frontend, bug"
                            value={formData.tags.join(", ")}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",").map(t => t.trim()) })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="px-4 py-2 rounded-md text-sm font-medium border border-border/50 hover:bg-secondary transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
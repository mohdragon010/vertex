"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { db } from "@/lib/firebase"
import { doc, Timestamp, updateDoc } from "firebase/firestore"
import { Button } from "./ui/button"
import { useState, useEffect } from "react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export default function EditProjectDialog({ open, setOpen, workspaceId, project, allProjects }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        color: "#6366F1",
        deadline: "",
        status: "active",
    })

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || "",
                description: project.description || "",
                color: project.color || "#6366F1",
                deadline: project.deadline || "",
                status: project.status || "active",
            })
        }
    }, [project])

    const updateProject = async () => {
        if (!formData.title.trim()) {
            setError("Project title is required")
            return
        }

        setLoading(true)
        setError(null)

        try {
            const docRef = doc(db, "workspaces", workspaceId)
            
            const updatedProject = {
                ...project,
                ...formData,
                updatedAt: Timestamp.now()
            }

            const updatedProjects = allProjects.map(p => 
                p.id === project.id ? updatedProject : p
            )

            await updateDoc(docRef, {
                projects: updatedProjects
            })

            console.log("Project updated successfully")
            setOpen(false)
        } catch (err) {
            console.error("Error updating project:", err)
            setError(err.message || "Failed to update project")
        } finally {
            setLoading(false)
        }
    }

    const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899"];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-106.25 bg-background border-border">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Edit Project</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                            {error}
                        </div>
                    )}
                    
                    {/* Project Title */}
                    <div className="grid gap-2">
                        <Label htmlFor="edit-title">Project Name</Label>
                        <Input
                            id="edit-title"
                            placeholder="e.g. Website Redesign"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            disabled={loading}
                        />
                    </div>

                    {/* Description */}
                    <div className="grid gap-2">
                        <Label htmlFor="edit-desc">Description</Label>
                        <Textarea
                            id="edit-desc"
                            placeholder="What is this project about?"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            disabled={loading}
                        />
                    </div>

                    {/* Color Selection */}
                    <div className="grid gap-2">
                        <Label>Theme Color</Label>
                        <div className="flex gap-2.5">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`w-6 h-6 rounded-full transition-all hover:scale-110 ${formData.color === color ? "ring-2 ring-white ring-offset-2 ring-offset-background" : ""
                                        }`}
                                    style={{ backgroundColor: color }}
                                    disabled={loading}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Deadline */}
                        <div className="grid gap-2">
                            <Label>Deadline</Label>
                            <Input
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                disabled={loading}
                            />
                        </div>

                        {/* Status */}
                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val) => setFormData({ ...formData, status: val })}
                                disabled={loading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
                    <Button
                        className="bg-vertex-primary hover:bg-vertex-primary/90"
                        onClick={updateProject}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
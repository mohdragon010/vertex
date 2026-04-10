"use client";

import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState, useEffect } from "react";
import { v4 } from "uuid";
import useAuth from "@/hooks/useAuth";
import { collection, doc, documentId, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";



export default function CreateTaskDialog({ project }) {
    const user = useAuth()
    const { workspaceSlug, projectId } = useParams();
    const [emails, setEmails] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "todo", // todo, in-progress, done
        priority: "low", // low, medium, high,
        assignedTo: user?.uid || "",
        tags: [],
        deadline: "",
    }) 
    
    const getMembers = async () => {
        try {
            if (!workspaceSlug) return []
            const collectionRef = collection(db, "workspaces");
            const q = query(collectionRef, where("slug", "==", workspaceSlug));
            const snap = await getDocs(q);
            if(snap.empty) return []
            return snap.docs[0].data().members || [];
        } catch(err) {
            console.log(err) 
            return []
        }
    }

    const chunkArray = (arr, size) => {
        const result = []
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size))
        }
        return result
    }

    const getMembersEmails = async () => {
        try {
            const usersId = await getMembers()
            if (!usersId.length) return []

            const chunks = chunkArray(usersId, 10)
            const collectionRef = collection(db, "users")

            let emails = []

            for (const chunk of chunks) {
                const q = query(collectionRef, where(documentId(), "in", chunk))
                const snap = await getDocs(q)

                snap.docs.forEach(doc => {
                    emails.push(doc.data().email || "")
                })
            }

            return emails
        } catch (err) {
            console.log(err)
            return []
        }
    }

    const createNewTask = async (e) => {
        e.preventDefault();
        try {
            const workspaceQuery = query(collection(db, "workspaces"), where("slug", "==", workspaceSlug));
            const workspaceSnap = await getDocs(workspaceQuery);
            
            if (workspaceSnap.empty) {
                console.error("Workspace not found");
                return;
            }

            const workspaceDoc = workspaceSnap.docs[0];
            const workspaceData = workspaceDoc.data();
            const workspaceRef = doc(db, "workspaces", workspaceDoc.id);

            const updatedProjects = workspaceData.projects.map((proj) => {
                if (proj.id === projectId) {
                    const newTask = {
                        ...formData,
                        id: v4(),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        createdBy: user?.uid || "unknown",
                        order: (proj.tasks || []).length
                    };
                    
                    return {
                        ...proj,
                        tasks: [...(proj.tasks || []), newTask]
                    };
                }
                return proj;
            });

            await updateDoc(workspaceRef, {
                projects: updatedProjects
            });

            console.log("Task created successfully!");
            
        } catch (err) {
            console.error("Error creating task:", err);
        }
    };

    useEffect(() => {
        getMembersEmails().then(setEmails);
    }, [workspaceSlug]);

    return(
        <Dialog>
            <DialogTrigger asChild>
                <button className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-border/50 text-foreground hover:bg-secondary transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    Add task
                </button>
            </DialogTrigger>

            <DialogContent>


                <DialogHeader>
                    <DialogTitle>Create new task</DialogTitle>
                    <DialogDescription>
                        Add a new task to your project.
                    </DialogDescription>
                </DialogHeader>


                <form onSubmit={createNewTask} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input 
                            id="title" 
                            name="title" 
                            placeholder="Enter task title" 
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                            id="description" 
                            name="description" 
                            placeholder="Enter task description" 
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select 
                                value={formData.status} 
                                onValueChange={(val) => setFormData({ ...formData, status: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todo">To Do</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="done">Done</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select 
                                value={formData.priority} 
                                onValueChange={(val) => setFormData({ ...formData, priority: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input 
                                id="deadline" 
                                type="date" 
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Assigned To</Label>
                            <Select 
                                value={formData.assignedTo} 
                                onValueChange={(val) => setFormData({ ...formData, assignedTo: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select User" />
                                </SelectTrigger>
                                <SelectContent>
                                    {emails.length === 0 && (
                                        <SelectItem value="loading" disabled>
                                            Loading...
                                        </SelectItem>
                                    )}
                                    {emails.map((email) => (
                                        <SelectItem key={email} value={email}>
                                            {email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input 
                            id="tags" 
                            placeholder="e.g. frontend, bug" 
                            value={formData.tags.join(", ")}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",").map(t => t.trim()) })}
                        />
                    </div>
                    
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm transition-colors">
                            Create Task
                        </button>
                    </div>
                </form>

            </DialogContent>
        </Dialog>
    )
}
"use client";

import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState } from "react";
import { v4 } from "uuid";
import useAuth from "@/hooks/useAuth";
import { collection, documentId, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";



export default function CreateTaskDialog() {
    const user = useAuth()
    const { workspaceSlug, projectId } = useParams();
    const [formData, useFormData] = useState({
        title: "",
        description: "",
        status: "todo", // todo, in-progress, done
        priority: "low", // low, medium, high,
        assignedTo: user.uid,
        tags: [],
        deadline: null,
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
    const members = getMembersEmails().then(membersEmails => {
        console.log("members:",membersEmails)
    })
    const createNewTask = async () => {

    }

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


                <form onSubmit={createNewTask}>

                </form>

            </DialogContent>
        </Dialog>
    )
}
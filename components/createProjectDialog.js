"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { db } from "@/lib/firebase"
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore"
import { Button } from "./ui/button"

export default function CreateProjectDialog({ open, setOpen, workspaceId}) {
        const createProject = async () => {
            const docRef = doc(db, "workspaces", workspaceId)
            try {
                await updateDoc(docRef,{
                    projects:arrayUnion({
                        title: "this is test",
                        createdAt:Timestamp.now()
                    })
                });
                console.log("done successfully")
            } catch(err) {
                console.log(err)
            }

        }
    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new project</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                {workspaceId}
                <DialogFooter>
                    <Button onClick={createProject}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
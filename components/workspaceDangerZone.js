"use client"
import { useState } from "react"
import { db } from "@/lib/firebase"
import { doc, deleteDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { AlertTriangle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"

export default function WorkspaceDangerZone({ workspace }) {
    const router = useRouter()
    const [confirmName, setConfirmName] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)
    const [open, setOpen] = useState(false)

    const handleDelete = async () => {
        if (confirmName !== workspace.name) return

        setIsDeleting(true)
        try {
            await deleteDoc(doc(db, "workspaces", workspace.id))
            setOpen(false)
            router.push("/workspaces")
        } catch (error) {
            console.error("Error deleting workspace:", error)
            setIsDeleting(false)
        }
    }

    return (
        <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6 lg:p-8 space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-destructive flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6" />
                    Danger Zone
                </h2>
                <p className="text-muted-foreground text-sm mt-2">
                    Irreversible and destructive actions. Please be careful.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-destructive/20 rounded-lg bg-background">
                <div>
                    <h3 className="font-semibold">Delete this workspace</h3>
                    <p className="text-sm text-muted-foreground">
                        Once you delete a workspace, there is no going back. Please be certain.
                    </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="destructive" className="shrink-0">
                            Delete Workspace
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-destructive flex items-center gap-2">
                                <Trash2 className="w-5 h-5" />
                                Delete Workspace
                            </DialogTitle>
                            <DialogDescription className="text-base text-foreground mt-2">
                                This action cannot be undone. This will permanently delete the
                                <strong> {workspace.name} </strong> 
                                workspace and remove all associated data.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <p className="text-sm font-medium">
                                Please type <span className="font-bold font-mono Select-all bg-muted px-1.5 py-0.5 rounded text-destructive">{workspace.name}</span> to confirm.
                            </p>
                            <Input
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                                placeholder={workspace.name}
                                className="font-mono"
                            />
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="ghost" onClick={() => setOpen(false)} disabled={isDeleting}>
                                Cancel
                            </Button>
                            <Button 
                                variant="destructive" 
                                onClick={handleDelete} 
                                disabled={isDeleting || confirmName !== workspace.name}
                            >
                                {isDeleting && <Spinner className="mr-2" />}
                                I understand the consequences, delete this workspace
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

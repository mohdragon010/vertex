"use client"
import { useState } from "react"
import { db } from "@/lib/firebase"
import { collection, doc, query, updateDoc, where, arrayUnion, getDocs } from "firebase/firestore"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AddWorkspaceMember({ workspace }) {
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [alertDialog, setAlertDialog] = useState({ open: false, title: "", description: "", isError: false });

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!newMemberEmail.trim()) return;

        setIsActionLoading(true);
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", newMemberEmail.trim()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setAlertDialog({ open: true, title: "User Not Found", description: "No user found with this email address.", isError: true });
                setIsActionLoading(false);
                return;
            }

            const userDoc = querySnapshot.docs[0];
            const userId = userDoc.id;

            if (workspace.members?.includes(userId)) {
                setAlertDialog({ open: true, title: "Already a Member", description: "This user is already a member of the workspace.", isError: true });
                setIsActionLoading(false);
                return;
            }

            const docRef = doc(db, "workspaces", workspace.id);
            await updateDoc(docRef, {
                members: arrayUnion(userId)
            });
            setNewMemberEmail("");
            setAlertDialog({ open: true, title: "Success", description: "User added successfully!", isError: false });
        } catch (error) {
            console.error("Error adding member:", error);
            setAlertDialog({ open: true, title: "Error", description: "Failed to add member. Please try again.", isError: true });
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <>
            <div className="bg-card border border-border rounded-xl p-6 sticky top-10">
                <h2 className="text-xl font-bold mb-6 tracking-tight flex items-center gap-2">
                    <Plus className="w-5 h-5 text-vertex-primary" /> Add Member
                </h2>
                
                <form onSubmit={handleAddMember} className="space-y-6">
                    <div className="space-y-3">
                        <Label htmlFor="newMemberEmail" className="text-muted-foreground font-bold uppercase text-xs tracking-wider">User Email</Label>
                        <Input 
                            id="newMemberEmail"
                            type="email"
                            placeholder="Enter user email..."
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            className="h-11 rounded-lg border-border bg-background focus-visible:ring-primary"
                            disabled={isActionLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                            Enter the exact email address to grant access.
                        </p>
                    </div>
                    
                    <Button 
                        type="submit" 
                        disabled={isActionLoading || !newMemberEmail.trim()}
                        className="w-full bg-vertex-primary hover:bg-vertex-primary text-white rounded-2xl h-14 font-black  transition-all active:scale-95 group"
                    >
                        {isActionLoading ? "Adding..." : "Add to Workspace"}
                    </Button>
                </form>
            </div>

            <Dialog open={alertDialog.open} onOpenChange={(open) => setAlertDialog(prev => ({ ...prev, open }))}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className={alertDialog.isError ? "text-destructive" : "text-green-500"}>
                            {alertDialog.title}
                        </DialogTitle>
                        <DialogDescription className="text-base text-foreground mt-2">
                            {alertDialog.description}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setAlertDialog(prev => ({ ...prev, open: false }))}>
                            Got it!
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

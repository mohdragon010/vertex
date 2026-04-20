"use client"
import { useState } from "react"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import useAuth from "@/hooks/useAuth"
import { createInvitation } from "@/lib/notifications"

export default function AddWorkspaceMember({ workspace }) {
    const { user, userDoc } = useAuth();
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [alertDialog, setAlertDialog] = useState({ open: false, title: "", description: "", isError: false });

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!newMemberEmail.trim()) return;
        if (!user?.uid) {
            setAlertDialog({ open: true, title: "Not signed in", description: "You need to be signed in to send invitations.", isError: true });
            return;
        }

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

            const foundUser = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };

            if (workspace.members?.includes(foundUser.id) || workspace.adminId === foundUser.id) {
                setAlertDialog({ open: true, title: "Already a Member", description: "This user is already a member of the workspace.", isError: true });
                setIsActionLoading(false);
                return;
            }

            await createInvitation({
                workspace,
                fromUser: {
                    uid: user.uid,
                    email: user.email,
                    displayName: userDoc?.name || user.displayName || user.email,
                },
                toUser: foundUser,
            });

            setNewMemberEmail("");
            setAlertDialog({
                open: true,
                title: "Invitation sent",
                description: `${foundUser.name || foundUser.email} will see the invite in their notifications and can accept or decline.`,
                isError: false,
            });
        } catch (error) {
            console.error("Error inviting member:", error);
            const msg = error?.code === "invite/duplicate"
                ? "An invitation is already pending for this user."
                : "Failed to send invitation. Please try again.";
            setAlertDialog({ open: true, title: "Error", description: msg, isError: true });
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <>
            <div className="bg-card border border-border rounded-xl p-6 sticky top-10">
                <h2 className="text-xl font-bold mb-6 tracking-tight flex items-center gap-2">
                    <Plus className="w-5 h-5 text-vertex-primary" /> Invite Member
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
                            We'll send them an in-app invitation. They join only after accepting.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        disabled={isActionLoading || !newMemberEmail.trim()}
                        className="w-full bg-vertex-primary hover:bg-vertex-primary text-white rounded-2xl h-14 font-black  transition-all active:scale-95 group"
                    >
                        {isActionLoading ? "Sending..." : "Send Invitation"}
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

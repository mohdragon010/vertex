"use client"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { doc, updateDoc, arrayRemove, getDoc } from "firebase/firestore"
import { Shield, Trash2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

export default function WorkspaceMembersList({ workspace }) {
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [membersDetails, setMembersDetails] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [alertDialog, setAlertDialog] = useState({ open: false, title: "", description: "", isError: false });
    const [confirmDialog, setConfirmDialog] = useState({ open: false, memberIdToRemove: null });

    useEffect(() => {
        const fetchMembersDetails = async () => {
            if (!workspace?.members?.length) {
                setMembersDetails([]);
                setLoadingDetails(false);
                return;
            }
            setLoadingDetails(true);
            try {
                const promises = workspace.members.map(async (uid) => {
                    const userDoc = await getDoc(doc(db, "users", uid));
                    if (userDoc.exists()) {
                        return { id: userDoc.id, ...userDoc.data() };
                    }
                    return { id: uid, name: "Unknown User", email: "No email" };
                });
                const details = await Promise.all(promises);
                setMembersDetails(details);
            } catch (err) {
                console.error("Failed to fetch member details", err);
            } finally {
                setLoadingDetails(false);
            }
        };

        fetchMembersDetails();
    }, [workspace?.members]);

    const handleRemoveMember = (memberId) => {
        if (memberId === workspace.adminId) {
            setAlertDialog({ open: true, title: "Action Not Allowed", description: "You cannot remove the admin of the workspace.", isError: true });
            return;
        }
        setConfirmDialog({ open: true, memberIdToRemove: memberId });
    };

    const executeRemoveMember = async () => {
        if (!confirmDialog.memberIdToRemove) return;
        setIsActionLoading(true);
        try {
            const docRef = doc(db, "workspaces", workspace.id);
            await updateDoc(docRef, {
                members: arrayRemove(confirmDialog.memberIdToRemove)
            });
            setConfirmDialog({ open: false, memberIdToRemove: null });
            setAlertDialog({ open: true, title: "Success", description: "Member removed successfully.", isError: false });
        } catch (error) {
            console.error("Error removing member:", error);
            setAlertDialog({ open: true, title: "Error", description: "Failed to remove member. Please try again.", isError: true });
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold tracking-tight">{workspace.members?.length || 0} Member(s)</h2>
            </div>

            <div className="space-y-3">
                {loadingDetails ? (
                    Array.from({ length: Math.max(1, workspace.members?.length || 1) }).map((_, i) => (
                        <Skeleton key={i} className="h-22 w-full rounded-xl" />
                    ))
                ) : (
                    membersDetails.map((member, idx) => {
                        const isAdmin = member.id === workspace.adminId;
                        let dateAdded = 'Unknown date';
                        if (member.createdAt) {
                            dateAdded = member.createdAt.toDate 
                                ? member.createdAt.toDate().toLocaleDateString() 
                                : new Date(member.createdAt).toLocaleDateString();
                        }
                        
                        return (
                            <div key={idx} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${isAdmin ? 'bg-amber-100 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-600' : 'bg-muted border-border text-muted-foreground'}`}>
                                        {isAdmin ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-base leading-none">{member.name || member.id}</h3>
                                            {isAdmin && (
                                                <span className="text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950/30 text-amber-600 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                                                    Admin
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {member.email} • Joined {dateAdded}
                                        </p>
                                    </div>
                                </div>
                                
                                {!isAdmin && (
                                    <Button 
                                        variant="ghost" 
                                        size="icon"
                                        disabled={isActionLoading}
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="w-10 h-10 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                        title="Remove member"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        )
                    })
                )}
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

            <Dialog open={confirmDialog.open} onOpenChange={(open) => !isActionLoading && setConfirmDialog(prev => ({ ...prev, open }))}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Remove Member</DialogTitle>
                        <DialogDescription className="text-base mt-2">
                            Are you sure you want to remove this member from the workspace? They will lose access to all projects inside.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" disabled={isActionLoading} onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}>
                            Cancel
                        </Button>
                        <Button variant="destructive" disabled={isActionLoading} onClick={executeRemoveMember}>
                            {isActionLoading ? "Removing..." : "Remove Member"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

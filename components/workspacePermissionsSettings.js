"use client"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { doc, updateDoc, getDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { UserCog } from "lucide-react"

export default function WorkspacePermissionsSettings({ workspace }) {
    const [membersDetails, setMembersDetails] = useState([])
    const [loadingMembers, setLoadingMembers] = useState(true)
    const [selectedAdminId, setSelectedAdminId] = useState(workspace.adminId)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState({ type: "", text: "" })

    useEffect(() => {
        const fetchMembersDetails = async () => {
            if (!workspace?.members?.length) {
                setMembersDetails([])
                setLoadingMembers(false)
                return
            }
            setLoadingMembers(true)
            try {
                const promises = workspace.members.map(async (uid) => {
                    const userDoc = await getDoc(doc(db, "users", uid))
                    if (userDoc.exists()) {
                        return { id: userDoc.id, ...userDoc.data() }
                    }
                    return { id: uid, name: "Unknown User", email: "No email" }
                })
                const details = await Promise.all(promises)
                setMembersDetails(details)
            } catch (err) {
                console.error("Failed to fetch member details", err)
            } finally {
                setLoadingMembers(false)
            }
        }
        fetchMembersDetails()
    }, [workspace?.members])

    const handleTransferOwnership = async () => {
        if (selectedAdminId === workspace.adminId) return
        
        setIsSubmitting(true)
        setMessage({ type: "", text: "" })
        try {
            const docRef = doc(db, "workspaces", workspace.id)
            await updateDoc(docRef, {
                adminId: selectedAdminId
            })
            setMessage({ type: "success", text: "Permissions updated. You may lose admin access if transferred to someone else." })
        } catch (error) {
            console.error("Error updating permissions:", error)
            setMessage({ type: "error", text: "Failed to update permissions." })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-card border border-border rounded-xl p-6 lg:p-8 space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <UserCog className="w-6 h-6" />
                    Permissions
                </h2>
                <p className="text-muted-foreground mt-1">
                    Transfer ownership of this workspace to another member.
                </p>
            </div>

            {loadingMembers ? (
                <div className="h-10 w-full animate-pulse bg-muted rounded-md" />
            ) : (
                <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Workspace Admin</label>
                        <select
                            value={selectedAdminId}
                            onChange={(e) => setSelectedAdminId(e.target.value)}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {membersDetails.map(member => (
                                <option key={member.id} value={member.id}>
                                    {member.name || member.email} {member.id === workspace.adminId ? "(Current Admin)" : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    {message.text && (
                        <p className={`text-sm font-medium ${message.type === 'error' ? 'text-destructive' : 'text-amber-600'}`}>
                            {message.text}
                        </p>
                    )}

                    <Button
                        onClick={handleTransferOwnership}
                        disabled={isSubmitting || selectedAdminId === workspace.adminId}
                        className="w-full sm:w-auto"
                        variant="outline"
                    >
                        {isSubmitting && <Spinner className="mr-2" />}
                        Transfer Ownership
                    </Button>
                </div>
            )}
        </div>
    )
}

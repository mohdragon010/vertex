"use client"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

export default function WorkspaceMembersDropdownWrapper({ members, children }) {
    const [membersDetails, setMembersDetails] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMembersDetails = async () => {
            if (!members?.length) {
                setMembersDetails([])
                setLoading(false)
                return
            }
            setLoading(true)
            try {
                const promises = members.map(async (uid) => {
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
                setLoading(false)
            }
        }

        fetchMembersDetails()
    }, [members])

    if (loading) {
        return <>{children}</>
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="cursor-pointer">
                    {children}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 max-h-75 overflow-y-auto" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                <DropdownMenuLabel>Workspace Members ({membersDetails.length})</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {membersDetails.map(member => {
                    let dateAdded = 'Unknown date';
                    if (member.createdAt) {
                        dateAdded = member.createdAt.toDate 
                            ? member.createdAt.toDate().toLocaleDateString() 
                            : new Date(member.createdAt).toLocaleDateString();
                    }
                    return (
                        <DropdownMenuItem key={member.id} className="flex flex-col items-start gap-1 p-3 cursor-default">
                            <span className="font-bold">{member.name || "Unknown User"}</span>
                            <span className="text-xs text-muted-foreground">{member.email}</span>
                            <span className="text-[10px] text-muted-foreground mt-1">Joined: {dateAdded}</span>
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

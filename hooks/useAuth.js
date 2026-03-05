"use client";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useState } from "react";

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userDoc, setUserDoc] = useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            console.log("Current user:", currentUser);

            if (currentUser) {
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUserDoc({ id: userDocSnap.id, ...userDocSnap.data()});
                    console.log("User document data:", userDocSnap.data());
                }
            }
        })
        return () => unsubscribe();
    });

    const logout = async () => {
        try {
            await signOut(auth);
            console.log("User signed out successfully");
        } catch(err) {
            console.log("Error signing out:", err);
        }
    };

    return { user, userDoc, loading, logout};
}
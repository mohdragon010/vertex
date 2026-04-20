"use client";

import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userDoc, setUserDoc] = useState(null);

    useEffect(() => {
        let unsubscribeDoc = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            if (unsubscribeDoc) {
                unsubscribeDoc();
                unsubscribeDoc = null;
            }

            if (currentUser) {
                const userDocRef = doc(db, "users", currentUser.uid);
                unsubscribeDoc = onSnapshot(userDocRef, (snap) => {
                    if (snap.exists()) setUserDoc({ id: snap.id, ...snap.data() });
                    else setUserDoc(null);
                });
            } else {
                setUserDoc(null);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeDoc) unsubscribeDoc();
        };
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.log("Error signing out:", err);
        }
    };

    return { user, userDoc, loading, logout };
}

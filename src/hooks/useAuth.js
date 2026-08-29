// hooks/useAuth.js
import { useState, useEffect } from 'react'
import { auth, db } from '../data/firebase.js'
import { signInAnonymously, onAuthStateChanged, deleteUser } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove, collection, getDocs, query, where } from 'firebase/firestore'

export const useAuth = () => {
    const [uid, setUid] = useState(null)
    const [profile, setProfile] = useState(null)

    //EFFECT 1: sign the user in anonymously if they aren't already, then load their firestore profile (or create one on first visit)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                signInAnonymously(auth)
                return //onAuthStateChanged fires again once the anonymous sign-in resolves
            }

            setUid(user.uid)

            const userRef = doc(db, "users", user.uid)
            const snapshot = await getDoc(userRef)

            if (snapshot.exists()) {
                setProfile(snapshot.data())
            } else {
                const newProfile = { firstName: null, lastName: null, userName: null, favoriteRoutes: [] }
                await setDoc(userRef, newProfile)
                setProfile(newProfile)
            }
        })

        return () => unsubscribe()
    }, [])

    //updates the user's display name in firestore and mirrors it in local state
    const setName = async ({firstName, lastName, userName}) => {
        await updateDoc(doc(db, "users", uid), { firstName, lastName, userName })
        setProfile(prev => ({ ...prev, firstName, lastName, userName }))
    }

    //adds/removes a route from the user's favorites in firestore and mirrors the change in local state
    const toggleFavorite = async (routeId) => {
        const isFavorited = profile.favoriteRoutes.includes(routeId)
        await updateDoc(doc(db, "users", uid), {
            favoriteRoutes: isFavorited ? arrayRemove(routeId) : arrayUnion(routeId)
        })
        setProfile(prev => ({
            ...prev,
            favoriteRoutes: isFavorited
                ? prev.favoriteRoutes.filter(r => r !== routeId)
                : [...prev.favoriteRoutes, routeId]
        }))
    }

    const isUsernameTaken = async (candidate) => {
        const q = query(collection(db, "users"), where("userName", "==", candidate))
        const snapshot = await getDocs(q)
        return !snapshot.empty
    }

    //deletes the firestore profile, then the anonymous auth user itself.
    //removing the auth user makes onAuthStateChanged fire with null, which re-runs
    //the anonymous sign-in above and hands back a fresh uid with a blank profile
    const deleteProfile = async () => {
        if (!uid) return
        await deleteDoc(doc(db, "users", uid))
        setProfile(null)
        if (auth.currentUser) await deleteUser(auth.currentUser)
    }

    return { uid, profile, setName, toggleFavorite, isUsernameTaken, deleteProfile }
}
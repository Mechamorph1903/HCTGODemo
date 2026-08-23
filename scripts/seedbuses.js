// scripts/backfillRouteFields.js
import { db } from '../src/data/firebase.js'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'

const snapshot = await getDocs(collection(db, "routes"))

for (const routeDoc of snapshot.docs) {
    const data = routeDoc.data()
    const updates = {}

    // only set what's genuinely missing — never clobber a real value
    if (data.isActive === undefined) updates.isActive = true
    if (data.isSpecial === undefined) updates.isSpecial = false
    if (data.skippedStops === undefined) updates.skippedStops = []

    if (Object.keys(updates).length === 0) {
        console.log(`${routeDoc.id}: already complete, skipping`)
        continue
    }

    await updateDoc(doc(db, "routes", routeDoc.id), updates)
    console.log(`${routeDoc.id}: set ${Object.keys(updates).join(", ")}`)
}
// one-time script, not part of the app itself
import { db } from '../src/data/firebase'
import { collection, getDocs } from 'firebase/firestore'
import fs from 'fs'
fs.mkdirSync('scripts/output', { recursive: true })


const snapshot = await getDocs(collection(db, "stops"))
const stopsByRoute = {}

snapshot.forEach(doc => {
    const stop = doc.data()
    if (!stopsByRoute[stop.routeId]) stopsByRoute[stop.routeId] = []
    stopsByRoute[stop.routeId].push({
        type: "Feature",
        properties: { name: stop.name, stopNum: stop.stopNum },
        geometry: { type: "Point", coordinates: [stop.coords[1], stop.coords[0]] }   // flip to [lng, lat] for GeoJSON
    })
})

for (const routeId in stopsByRoute) {
    fs.writeFileSync(`scripts/output/${routeId}-stops.geojson`, JSON.stringify({
        type: "FeatureCollection",
        features: stopsByRoute[routeId]
    }, null, 2))
}
// scripts/importShapePoints.js
import { db } from '../src/data/firebase.js'
import { doc, updateDoc } from 'firebase/firestore'
import fs from 'fs'

const files = fs.readdirSync('scripts/output').filter(f => f.endsWith('.geojson') && !f.includes('-stops'))

for (const file of files) {
    const routeId = file.replace('.geojson', '')   // "gold.geojson" → "gold"
    const data = JSON.parse(fs.readFileSync(`scripts/output/${file}`, 'utf-8'))

    const lineFeature = data.features.find(f => f.geometry.type === 'LineString')
    if (!lineFeature) {
        console.log(`No LineString found in ${file}, skipping`)
        continue
    }

    const shapePoints = lineFeature.geometry.coordinates.map(([lng, lat]) => ({ lng, lat }))

    await updateDoc(doc(db, "routes", routeId), {
        shapePoints
    })
    console.log(`Wrote ${shapePoints.length} points to ${routeId}`)

}
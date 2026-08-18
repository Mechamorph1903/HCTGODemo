import { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../data/firebase.js'
import { collection, getDocs } from 'firebase/firestore'

const TransitDataContext = createContext({ routes: [], allStops: [], loading: true })

export function TransitDataProvider({ children }) {
  const [routes, setRoutes] = useState([])
  const [allStops, setAllStops] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [routesSnap, stopsSnap] = await Promise.all([
          getDocs(collection(db, "routes")),
          getDocs(collection(db, "stops")),
        ])
        const r = []
        routesSnap.forEach((doc) => r.push({ id: doc.id, ...doc.data() }))
        const s = []
        stopsSnap.forEach((doc) => s.push({ id: doc.id, ...doc.data() }))
        setRoutes(r)
        setAllStops(s)
      } catch (error) {
        console.error("Error fetching transit data: ", error)
      }
      setLoading(false)
    }
    fetchAll()
  }, [])

  return (
    <TransitDataContext.Provider value={{ routes, allStops, loading }}>
      {children}
    </TransitDataContext.Provider>
  )
}

export const useTransitData = () => useContext(TransitDataContext)

import { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../data/firebase.js'
import { collection, onSnapshot } from 'firebase/firestore'

const TransitDataContext = createContext({ routes: [], allStops: [], busDocs: [], loading: true })

export function TransitDataProvider({ children }) {
  const [routes, setRoutes] = useState([])
  const [allStops, setAllStops] = useState([])
  const [busDocs, setBusDocs] = useState([])
  const [loading, setLoading] = useState(true)

  //live listeners rather than a single fetch on mount. the one-shot meant an admin
  //change — a delay, a new special route, an edited stop — never reached an open tab
  useEffect(() => {
    const collect = (snap) => {
      const out = []
      snap.forEach((d) => out.push({ id: d.id, ...d.data() }))
      return out
    }

    const unsubRoutes = onSnapshot(collection(db, "routes"), (snap) => {
      setRoutes(collect(snap))
      setLoading(false)
    }, (error) => { console.error("routes listener failed:", error); setLoading(false) })

    const unsubStops = onSnapshot(collection(db, "stops"), (snap) => setAllStops(collect(snap)),
      (error) => console.error("stops listener failed:", error))

    const unsubBuses = onSnapshot(collection(db, "buses"), (snap) => setBusDocs(collect(snap)),
      (error) => console.error("buses listener failed:", error))

    return () => { unsubRoutes(); unsubStops(); unsubBuses() }
  }, [])

  return (
    <TransitDataContext.Provider value={{ routes, allStops, busDocs, loading }}>
      {children}
    </TransitDataContext.Provider>
  )
}

export const useTransitData = () => useContext(TransitDataContext)

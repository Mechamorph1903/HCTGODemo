import { createContext, useContext, useState, useEffect } from 'react'

const BusPositionsContext = createContext([])

export function BusPositionsProvider({ children }) {
  const [busPositions, setBusPositions] = useState([])

  useEffect(() => {
    const fetchBusLive = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_ARCGIS_URL)
        if (!res.ok) return
        const data = await res.json()
        setBusPositions(data.features || [])
      } catch (err) {
        console.log(err)
      }
    }
    fetchBusLive()
    const timer = setInterval(fetchBusLive, 15000)
    return () => clearInterval(timer)
  }, [])

  return (
    <BusPositionsContext.Provider value={busPositions}>
      {children}
    </BusPositionsContext.Provider>
  )
}

export const useLiveBuses = () => useContext(BusPositionsContext)

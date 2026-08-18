import { useState, useEffect } from 'react'

//hook that polls the ESRI/ArcGIS live bus feed and hands back the latest positions
export const useLiveBuses = () => {
    const [busPositions, setBusPositions] = useState([])

    useEffect(() => {
        const fetchBusLive = async () => {
            try {
                const res = await fetch(import.meta.env.VITE_ARCGIS_URL)
                const data = await res.json()
                setBusPositions(data.features)
            } catch (err) {
                console.log(err)
            }
        }
        fetchBusLive() // grab positions immediately on mount
        const timer = setInterval(fetchBusLive, 5000) // then keep refreshing every 5s so buses feel "live"
        return () => clearInterval(timer) // stop polling once whatever's using this unmounts
    }, [])

    return busPositions
}
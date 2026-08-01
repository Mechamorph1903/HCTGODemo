import { useState, useEffect } from 'react'

//hook that polls the ESRI/ArcGIS live bus feed and hands back the latest positions
export const useLiveBuses = () => {
    const [busPositions, setBusPositions] = useState([])

    useEffect(() => {
        const fetchBusLive = async () => {
            try {
                const res = await fetch("https://utility.arcgis.com/usrsvcs/servers/b02066689d504f5f9428029f7268e060/rest/services/Hosted/8bd5047cc5bf4195887cc5237cf0d3e0_Track_View/FeatureServer/1/query?f=json&where=1=1&outFields=*")
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
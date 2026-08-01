import { useState, useEffect } from 'react'

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
        fetchBusLive()
        const timer = setInterval(fetchBusLive, 5000)
        return () => clearInterval(timer)
    }, [])

    return busPositions
}
import {greenStops, goldStops, orangeStops, blueStops, redStops, purpleStops, brownStops} from '../data/stops.js'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { MapContainer, Polyline, CircleMarker, TileLayer, useMap} from "react-leaflet"
import getRouteCentroid, { webMercatorToLatLng } from "../utils/coords.js"
import { useEffect, useState } from 'react'

export default function RoutePage({route}){
    const routes = [
          { stops: greenStops, color: '#38A800', name: 'Green', alt: "(4th Street)", passThru: ["USM", "Midtown", "Walmart @ 49"], Runtime: {start: "6:30", end: "6:30"}, offlineMap: "", "Average Wait Time": [30],info: "lorem ipsum"}, //Green Route is ordered and complete
          { stops: blueStops, color: '#0070FF' , name: 'Blue', alt: "(Hardy Street)", passThru: ["Midtown", "Turtle Creek"], Runtime: {start: "6:30", end: "6:30"}, offlineMap: "", "Average Wait Time": [30, 60],info: "lorem ipsum"},
          { stops: brownStops, color: '#732600' , name: 'Brown', alt: "(7th Street)", passThru: ["Highway 42", "Downtown"], Runtime: {start: "6:30", end: "6:30"}, offlineMap: "", "Average Wait Time": [45],info: "lorem ipsum"},
          { stops: goldStops, color: '#E6E600' , name: 'Gold', alt: "(USM)", passThru: ["Southern Miss"], Runtime: {start: "6:30", end: "6:30"}, offlineMap: "", "Average Wait Time": [15],info: "This Route goes through and around the beautiful campus of the University of Southern Mississippi, home of the Golden Eagles. Recommended for students getting around campus!"},
          { stops: purpleStops, color: '#A900E6' , name: 'Purple', alt: "(Palmer's Crossing)", passThru: ["Edwards Street", "Downtown"], Runtime: {start: "6:30", end: "6:30"}, offlineMap: "", "Average Wait Time": [50],info: "lorem ipsum"},
          { stops: orangeStops, color: '#FC921F' , name: 'Orange', alt: "(Broadway)", passThru: ["William Carey", "James St", "Downtown"], Runtime: {start: "6:30", end: "6:30"}, offlineMap: "", "Average Wait Time": [45],info: "lorem ipsum"},
          { stops: redStops, color: '#E60000' , name: 'Red', alt: "(Country Club)", passThru: ["Cloverleaf", "William Carey", "Walmart @ 49"], Runtime: {start: "6:30", end: "6:30"}, offlineMap: "", "Average Wait Time": [40],info: "lorem ipsum"}, //Ordered and Complete
          
        ]
    

        const currRoute = routes.find(line => line.name === route)

        const minlat = Math.min(...currRoute.stops.map(stop => stop.coords[0]))
        const minlng = Math.min(...currRoute.stops.map(stop => stop.coords[1]))
        const maxlat = Math.max(...currRoute.stops.map(stop => stop.coords[0]))
        const maxlng = Math.max(...currRoute.stops.map(stop => stop.coords[1]))


        function BoundSetter(){
            const map = useMap()

           
            map.fitBounds([[minlat, minlng], [maxlat, maxlng]])

            return null
        }

        const radiuses = currRoute.stops.map(() => 25).join(";")

        const [snappedRoutes, getSnappedRoutes] = useState([])

        const routestring = currRoute.stops.map(stop => `${stop.coords[1]},${stop.coords[0]}`).join(";")
        useEffect(() => {
            const snaproutes = async () => {
                const response = await fetch(`https://router.project-osrm.org/match/v1/driving/${routestring}?overview=full&geometries=geojson&radiuses=${radiuses}`)
                const data = await response.json()
                getSnappedRoutes(data)
                console.log(snappedRoutes)
                console.log(routestring)
            }

            snaproutes()
        },[])
    return(
        <div className='text-black p-6'>
            <div className='flex justify-between h-15'>
                <NavLink to="/Lines"><FontAwesomeIcon icon="fa-solid fa-angle-left"  className='text-3xl'/></NavLink>
                <div className={`text-3xl rounded-xl h-3 w-3`} style={{ backgroundColor: currRoute.color }}></div>
            </div>
            <div className='grid '>
                <div>
                    
                    <div>
                        <h1>{currRoute.name} Route {currRoute.alt}</h1>
                        {/*This is where we put the lil info about the route and the times i.e use this route to get through bla bla bla*/}
                        <p>{currRoute.info}</p>
                        <p>Run Time: {currRoute.Runtime.start}a.m. to {currRoute.Runtime.end}p.m.</p>
                        <p>Frequency: {currRoute['Average Wait Time'].length === 2 ? `${currRoute['Average Wait Time'][0]} minutes (2 Buses) - ${currRoute['Average Wait Time'][1]} minutes (1 Bus)` : `${currRoute['Average Wait Time'][0]} minutes`} </p>
                    </div>
                    <div id="Map" className='h-128 w-full p-5'>
                        {/* The map containg the routes path */}
                        <MapContainer
                            center={getRouteCentroid(currRoute.stops)}
                            zoom={12.45} 
                            minZoom={12}
                            maxZoom={17}
                            className="h-full w-full"
                            maxBounds={[[minlat, minlng], [maxlat, maxlng]]}
                            maxBoundsViscosity={1}
                        >
                            <BoundSetter/>
                            <TileLayer
                                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />

                           
                                    <Polyline 
                                    positions={currRoute.stops.sort((a, b) => a.stopNum - b.stopNum).map(stop => stop.coords)}
                                    color={currRoute["color"]}
                                    weight={6}
                                    />
                                    {currRoute["stops"].map(stop => (
                                        <CircleMarker 
                                        key={stop.id}
                                        center={stop.coords}
                                        radius={2}
                                        fillColor="white"
                                        color='grey'
                                        fillOpacity={4}
                                        weight={1}
                                        />
                                    ))}
                                    {/* {
                                        busPositions.map( bus => (
                                        <CircleMarker
                                            key={bus.attributes.objectid}
                                            center={[bus.geometry.y, bus.geometry.x]}
                                            radius={5}
                                            fillColor={getBusColor(bus.attributes.created_user)}
                                            color='white'
                                            fillOpacity={4}
                                            weight={1}
                                        />
                                        )

                                        )
                                    } */}
                        </MapContainer>
                    </div>
                    <div>
                        {/* for the stops. expands to show arrival times and/or stop pictures*/}
                    </div>
                </div>
            </div>
        </div>
    )
}
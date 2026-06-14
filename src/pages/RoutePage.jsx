import {greenStops, goldStops, orangeStops, blueStops, redStops, purpleStops, brownStops} from '../data/stops.js'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { MapContainer, Polyline, CircleMarker, TileLayer, useMap} from "react-leaflet"
import getRouteCentroid, { webMercatorToLatLng } from "../utils/coords.js"
import { useEffect, useState } from 'react'

export default function RoutePage({route}){
    const routes = [
          { stops: greenStops, color: '#38A800', name: 'Green', alt: "(4th Street)", passThru: ["USM", "Midtown", "Walmart @ 49"], Runtime: {start: "6:30", end: "6:30"}, offlineMap: "", "Average Wait Time": [30],info: "Connects Downtown to USM campus via 4th Street, serving Midtown and the Walmart on Highway 49."}, //Green Route is ordered and complete
          { stops: blueStops, color: '#0070FF' , name: 'Blue', alt: "(Hardy Street)", passThru: ["Midtown", "Turtle Creek"], Runtime: {start: "6:30", end: "6:30"}, offlineMap: "", "Average Wait Time": [30, 60],info: "Our Longest route that spans the width of hattiesburg! Runs along Hardy Street from Downtown to Turtle Creek Mall, serving USM and major retail areas."},
          { stops: brownStops, color: '#732600' , name: 'Brown', alt: "(7th Street)", passThru: ["Highway 42", "Downtown"], Runtime: {start: "6:30", end: "6:30"}, offlineMap: "", "Average Wait Time": [45],info: "Runs north along Highway 42 from Downtown through residential neighborhoods to North Hattiesburg."},
          { stops: goldStops, color: '#E6E600' , name: 'Gold', alt: "(USM)", passThru: ["Southern Miss"], Runtime: {start: "6:30", end: "6:30"}, offlineMap: "", "Average Wait Time": [15],info: "This Route goes through and around the beautiful campus of the University of Southern Mississippi, home of the Golden Eagles. Recommended for students getting around campus!"},
          { stops: purpleStops, color: '#A900E6' , name: 'Purple', alt: "(Palmer's Crossing)", passThru: ["Edwards Street", "Downtown"], Runtime: {start: "6:30", end: "6:30"}, offlineMap: "", "Average Wait Time": [50],info: "Connects Downtown to Palmer's Crossing and the JM Tatum Industrial corridor via Edwards Street."},
          { stops: orangeStops, color: '#FC921F' , name: 'Orange', alt: "(Broadway)", passThru: ["William Carey", "James St", "Downtown"], Runtime: {start: "6:30", end: "6:30"}, offlineMap: "", "Average Wait Time": [45],info: "Runs through South Hattiesburg via Broadway Drive, serving William Carey University and the Walmart on Highway 49."},
          { stops: redStops, color: '#E60000' , name: 'Red', alt: "(Country Club)", passThru: ["Cloverleaf", "William Carey", "Walmart @ 49"], Runtime: {start: "6:30", end: "6:30"}, offlineMap: "", "Average Wait Time": [40],info: "Serves the Country Club Road corridor, Cloverleaf area, and connects to William Carey University."}, //Ordered and Complete
          
        ]
        
        const [expandedStop, setExpandedStop] = useState(null)

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

        
        {/**
            this area is for route snapping. claude tells me i have to get the coordinates in lng,lat order deperated by a 
            semi-colon and then put them all in a string to send to an engine. i did this but orsm says the request is bad so ill have to put in on hold for now
            orsm because it is free will have to use whatever hct is currently using icl
            */}
        // const radiuses = currRoute.stops.map(() => 25).join(";")

        // const [snappedRoutes, getSnappedRoutes] = useState([])

        // const routestring = currRoute.stops.map(stop => `${stop.coords[1]},${stop.coords[0]}`).join(";")
        // useEffect(() => {
        //     const snaproutes = async () => {
        //         const response = await fetch(`https://router.project-osrm.org/match/v1/driving/${routestring}?overview=full&geometries=geojson&radiuses=${radiuses}`)
        //         const data = await response.json()
        //         getSnappedRoutes(data)
        //         console.log(snappedRoutes)
        //     }

        //     snaproutes()
        // },[])
    return(
        <div className='text-black p-6 pt-3 relative'>
            <div className='flex justify-between items-center h-15 sticky top-0 left-0 z-[2000] bg-white/70 backdrop-blur-md border-b border-slate-200/50 mb-3'>
                <NavLink to="/Lines"><FontAwesomeIcon icon="fa-solid fa-angle-left"  className='text-3xl'/></NavLink>
                <div className={`text-3xl rounded-xl h-3 w-3`}></div>
            </div>
            <div className='grid'>
                <div>
                    
                    <div className='pl-5 rounded-sm' style={{ borderLeft: `4px solid ${currRoute.color}` }}>
                        <h1 className='text-2xl'>{currRoute.name} Route {currRoute.alt}</h1>
                        {/*This is where we put the lil info about the route and the times i.e use this route to get through bla bla bla*/}
                        <p className='p-4'>{currRoute.info}</p>
                        <p className='text-slate-500'>Run Time: {currRoute.Runtime.start}a.m. to {currRoute.Runtime.end}p.m.</p>
                        <p className='text-slate-500'>Frequency: {currRoute['Average Wait Time'].length === 2 ? `${currRoute['Average Wait Time'][0]} minutes (2 Buses) - ${currRoute['Average Wait Time'][1]} minutes (1 Bus)` : `${currRoute['Average Wait Time'][0]} minutes`} </p>
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
                    <div className='flex flex-row gap-5 items-center mb-5'>
                        <p>Route Transfers</p>
                        <span className='inline-block rounded-lg h-2 w-2 bg-red-700'></span>
                        <span className='inline-block rounded-lg h-2 w-2 bg-blue-700'></span>
                        <span className='inline-block rounded-lg h-2 w-2 bg-green-600'></span>
                        <span className='inline-block rounded-lg h-2 w-2 bg-yellow-300'></span>
                        <span className='inline-block rounded-lg h-2 w-2 bg-amber-700'></span>
                        <span className='inline-block rounded-lg h-2 w-2 bg-purple-600'></span>
                        <span className='inline-block rounded-lg h-2 w-2 bg-orange-300'></span>
                    </div>
                    <div className='border-l-2 border-l-slate-400 pl-4'>
                        {/* for the stops. expands to show arrival times and/or stop pictures*/}
                        {
                            currRoute.stops.map((stop) => (
                                <div className='grid grid-cols-3 justify-center items-center mb-5 border-2 border-slate-200 rounded-lg p-3 h-23' key={stop.id}> 
                                    <div>{stop.name}</div>
                                    <div>
                                        <p>Next Scheduled: </p>
                                        <div></div>
                                    </div>
                                    <div className='flex flex-row items-center justify-self-end'>
                                        <div id="transfers" className='mr-5 flex gap-5 '>
                                            {
                                                stop.transfer[0] ? stop.transfer[1].map(transfer => (
                                                    <p className='text-xs'><span className='inline-block rounded-lg h-2 w-2' style={{backgroundColor: transfer}}></span></p>
                                                )) : <p></p>
                                            }
                                        </div>
                                        <div onClick={() => {
                                                setExpandedStop( expandedStop === stop.id ? null : stop.id)
                                            }} className='rounded-md border-1 h-6 2-6 flex items-center justify-center'>
                                                {
                                                    expandedStop === stop.id ? <FontAwesomeIcon icon="fa-solid fa-minus" /> :  <FontAwesomeIcon icon="fa-solid fa-plus" />
                                                }
                                        </div>
                                    </div>
                                    {
                                        expandedStop === stop.id && (
                                            <div className='col-span-3 h-14'>
                                                expanded
                                            </div>
                                        )
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
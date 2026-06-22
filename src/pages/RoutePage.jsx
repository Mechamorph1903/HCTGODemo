import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { MapContainer, Polyline, CircleMarker, TileLayer, useMap} from "react-leaflet"
import getRouteCentroid, { webMercatorToLatLng } from "../utils/coords.js"
import scheduleGenerator, { minutesToClockString, getNextArrivalStatus } from '../utils/schedule.js'
import { useEffect, useState } from 'react'
import { db } from '../data/firebase.js'
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore'

export default function RoutePage({route}){
    const [currRoute, setCurrRoute] = useState(null)
    const [routeStops, setRouteStops] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedStop, setExpandedStop] = useState(null)

    // 📡 EFFECT: Fetch individual route metadata and its relational stops array
    useEffect(() => {
        async function fetchRouteDetails() {
            try {
                // 1. Get Route metadata document (document name is lowercase route string)
                const routeId = route.toLowerCase();
                const routeDocRef = doc(db, "routes", routeId);
                const routeSnapshot = await getDoc(routeDocRef);
                
                if (routeSnapshot.exists()) {
                    const routeData = { id: routeSnapshot.id, ...routeSnapshot.data() };
                    setCurrRoute(routeData);

                    // 2. Query stops drawer where 'routeId' matches this line
                    const stopsQuery = query(collection(db, "stops"), where("routeId", "==", routeId));
                    const stopsSnapshot = await getDocs(stopsQuery);
                    const fetchedStops = [];
                    
                    stopsSnapshot.forEach((doc) => {
                        fetchedStops.push({ id: doc.id, ...doc.data() });
                    });

                    // Sort stops by stopNum so lines connect in correct order
                    fetchedStops.sort((a, b) => a.stopNum - b.stopNum);
                    setRouteStops(fetchedStops);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error loading route sub-module data: ", error);
                setLoading(false);
            }
        }
        fetchRouteDetails();
    }, [route]);

    if (loading || !currRoute) return <div className="p-6 text-slate-500">⏳ Syncing route details...</div>;
    
    const minlat = Math.min(...routeStops.map(stop => stop.coords[0]))
    const minlng = Math.min(...routeStops.map(stop => stop.coords[1]))
    const maxlat = Math.max(...routeStops.map(stop => stop.coords[0]))
    const maxlng = Math.max(...routeStops.map(stop => stop.coords[1]))


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
                        <p className='text-slate-500'>Run Time: {minutesToClockString(currRoute.runtime.start)} to {minutesToClockString(currRoute.runtime.end)}</p>
                        <p className='text-slate-500'>Frequency: {currRoute.frequency.length === 2 ? `${currRoute.frequency[1]} minutes (2 Buses) - ${currRoute.frequency[0]} minutes (1 Bus)` : `${currRoute.frequency[0]} minutes`} </p>
                    </div>
                    <div id="Map" className='h-128 w-full p-5'>
                        {/* The map containg the routes path */}
                        <MapContainer
                            center={getRouteCentroid(routeStops)}
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
                                    positions={routeStops.sort((a, b) => a.stopNum - b.stopNum).map(stop => stop.coords)}
                                    color={currRoute["color"]}
                                    weight={6}
                                    />
                                    {routeStops.map((stop, index) => (
                                        <CircleMarker 
                                        key={index}
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
                            routeStops.map((stop, index) => {
                                // 1. Generate the stop's full array of times first
                                const stopTimes = scheduleGenerator(
                                    stop.minuteOffset,
                                    currRoute.runtime.start,
                                    currRoute.runtime.end,
                                    currRoute.frequency,
                                    currRoute.isDualBus
                                );
                                // 2. Calculate its next arrival status instantly
                                const nextArrival = getNextArrivalStatus(stopTimes, currRoute.runtime.end);
                                
                                
                                return (
                                <div className='grid grid-cols-3 justify-center items-center mb-5 border-2 border-slate-200 rounded-lg p-3 gap-2' key={index}> 
                                    <div>{stop.name}</div>
                                    <div className='flex gap-2'>
                                        <p>Next Scheduled: </p>
                                        <div className='text-sm'>{nextArrival}</div>
                                    </div>
                                    <div className='flex flex-row items-center justify-self-end'>
                                        <div id="transfers" className='mr-5 flex gap-5 '>
                                            {
                                                stop.transfer?.available && stop.transfer?.connections ? (
                                                    stop.transfer.connections.split(", ").map((transferColor, tIdx) => (
                                                        <p className='text-xs' key={tIdx}>
                                                            <span className='inline-block rounded-lg h-2 w-2' style={{ backgroundColor: transferColor.trim().toLowerCase() }}></span>
                                                        </p>
                                                    ))
                                                ) : <p></p>
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
                                            <div className='col-span-3 mt-3 bg-slate-50 p-3 rounded-md'>
                                                <h3 className='text-sm font-semibold mb-2 text-slate-600'>Full Daily Schedule:</h3>
                                                <div className='flex flex-wrap gap-2'>
                                                    {
                                                        stopTimes.map((time, index) => (
                                                            <span key={index} className='bg-white border border-slate-200 px-2 py-1 rounded text-sm shadow-xs text-slate-700'>{time}</span>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            )})
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
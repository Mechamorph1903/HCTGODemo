import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import getRouteCentroid, { webMercatorToLatLng } from "../utils/coords.js"
import scheduleGenerator, { minutesToClockString, getNextArrivalStatus } from '../utils/schedule.js'
import { useLiveBuses } from '../hooks/busPositions.js'
import { buildLineCoords } from '../utils/navigation.js'
import { useEffect, useRef, useState } from 'react'
import { db } from '../data/firebase.js'
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore'
import mapboxgl from 'mapbox-gl'

export default function RoutePage({route}){
    const [currRoute, setCurrRoute] = useState(null)
    const [routeStops, setRouteStops] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedStop, setExpandedStop] = useState(null)
    const busPositions = useLiveBuses()

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

    //mapbox refs
    const map = useRef(null)
    const mapContainer = useRef(null)
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

     // rendering map
    useEffect(() => {
        if (!routeStops.length || !currRoute || !mapContainer.current) return
        if (map.current) return // already initialized

        const minlat = Math.min(...routeStops.map(stop => stop.coords[0]))
        const minlng = Math.min(...routeStops.map(stop => stop.coords[1]))
        const maxlat = Math.max(...routeStops.map(stop => stop.coords[0]))
        const maxlng = Math.max(...routeStops.map(stop => stop.coords[1]))

        map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-89.2903, 31.3271],
        zoom: 12
        })

        map.current.on('load', () => {
            map.current.fitBounds([[minlng, minlat], [maxlng, maxlat]], { padding: 40 })
            
            const stops =  routeStops.sort((a,b) => a.stopNum - b.stopNum)
            const lineCoords = buildLineCoords(currRoute, stops)
            if (stops.length > 1) lineCoords.push(lineCoords[0]) //wrapback to initial

            //Line
            map.current.addSource(`route-${currRoute.id}`, {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                    type: 'LineString',
                    coordinates: lineCoords
                    }
                }
            })

            map.current.addLayer({
                id: `route-line-${currRoute.id}`,
                type: 'line',
                source: `route-${currRoute.id}`,
                paint: {
                    'line-color': currRoute.color,
                    'line-width': 4
                }
            })

            //Stops

            map.current.addSource(`stops-${currRoute.id}`, {
            type: `geojson`,
            data: {
              type: 'FeatureCollection',
              features: stops.map(stop => ({
                type: 'Feature',
                properties: {
                  id: stop.id,
                  name: stop.name,
                  route: stop.routeId
                },
                geometry: {
                  type: "Point",
                  coordinates: [stop.coords[1], stop.coords[0]]
                }
              }))
            }
          })

          map.current.addLayer({
            id: `stops-stop-${currRoute.id}`,
            type: 'circle',
            source: `stops-${currRoute.id}`,
            paint: {
              'circle-radius': 4,
              'circle-color': '#ffffff',
              'circle-stroke-color': currRoute.color,
              'circle-stroke-width': 2
            }

          })

        })  
      }, [currRoute, routeStops])

      useEffect(() => {
        if (!map.current || !currRoute || !busPositions.length) return
        if (!map.current.isStyleLoaded()) return

        const routeBuses = busPositions.filter(bus =>
            bus.attributes.created_user.includes(currRoute.name)
        )

        const busGeoJSON = {
            type: 'FeatureCollection',
            features: routeBuses.map(bus => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [bus.geometry.x, bus.geometry.y]
                }
            }))
        }

        if (!map.current.getSource('bus-positions')) {
            map.current.addSource('bus-positions', { type: 'geojson', data: busGeoJSON })
            map.current.addLayer({
                id: 'bus-layer',
                type: 'circle',
                source: 'bus-positions',
                paint: {
                    'circle-radius': 8,
                    'circle-color': currRoute.color,
                    'circle-stroke-color': '#ffffff',
                    'circle-stroke-width': 2
                }
            })
        } else {
            map.current.getSource('bus-positions').setData(busGeoJSON)
        }
    }, [busPositions, currRoute])

    if (loading || !currRoute) return <div className="p-6 text-slate-500 dark:text-slate-400">⏳ Syncing route details...</div>;



    return(
        <div className='text-black dark:text-white p-6 pt-3 relative'>
            <div className='flex items-center gap-3 h-15 sticky top-0 left-0 z-[2000] bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 mb-3'>
                <NavLink to="/Lines" className='text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0'>
                    <FontAwesomeIcon icon="fa-solid fa-angle-left" className='text-2xl' />
                </NavLink>
                <span className='h-3 w-3 rounded-full shrink-0' style={{ backgroundColor: currRoute.color }}></span>
                <h2 className='font-bold text-lg tracking-tight truncate'>{currRoute.name} Route {currRoute.alt}</h2>
            </div>
            <div className='grid'>
                <div>
                    {currRoute.routeStatus?.status === "Active" && (
                        <div className="mb-6 p-4 bg-amber-500/50 border border-slate-800/10 rounded-xl shadow-md text-sm">
                            <h2 className="font-bold text-whblackite uppercase tracking-wide flex items-center gap-2 mb-1">
                            {currRoute.routeStatus.type === "Delay" ? "⚠️" : "🚧"} Notice: {currRoute.routeStatus.type} Active!
                            </h2>
                            
                            <p className="text-amber-900 font-medium leading-relaxed mb-2">
                            {currRoute.routeStatus.type === "Delay" 
                                ? "This route is currently experiencing a delay. Stop times are adjusted accordingly." 
                                : "This route is currently taking a detour and is running on a modified pattern."
                            }
                            </p>
                            
                            {currRoute.routeStatus.details && (
                            <p className="text-white text-xs italic bg-slate-600/40 p-2.5 rounded-lg border border-slate-800/60 mb-2">
                                💬 Dispatch Notes: {currRoute.routeStatus.details}
                            </p>
                            )}
                            
                            {currRoute.routeStatus.time !== 0 && (
                            <p className="text-amber-800 font-mono font-bold text-xs inline-block rounded-md">
                                ⏱️ Estimated Delay: +{currRoute.routeStatus.time} mins
                            </p>
                            )}
                        </div>
                    )}
                    <div className='pl-5 rounded-sm mb-5' style={{ borderLeft: `4px solid ${currRoute.color}` }}>
                        <h1 className='text-2xl'>{currRoute.name} Route {currRoute.alt}</h1>
                        {/*This is where we put the lil info about the route and the times i.e use this route to get through bla bla bla*/}
                        <p className='p-4'>{currRoute.info}</p>
                        <p className='text-slate-500 dark:text-slate-400'>Run Time: {minutesToClockString(currRoute.runtime.start)} to {minutesToClockString(currRoute.runtime.end)}</p>
                        <p className='text-slate-500 dark:text-slate-400'>Frequency: {currRoute.frequency.length === 2 ? `${currRoute.frequency[1]} minutes (2 Buses) - ${currRoute.frequency[0]} minutes (1 Bus)` : `${currRoute.frequency[0]} minutes`} </p>
                    </div>

                    {/**Mapbox container */}
                    <div id="Map" ref={mapContainer} className='h-128 w-full rounded-xl'/>

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
                    <div className='border-l-2 border-l-slate-400 dark:border-l-slate-600 pl-4'>
                        {/* for the stops. expands to show arrival times and/or stop pictures*/}
                        {
                            routeStops.map((stop, index) => {
                                // 1. Generate the stop's full array of times first
                                const stopTimes = scheduleGenerator(
                                    stop.minuteOffset,
                                    currRoute.runtime.start,
                                    currRoute.runtime.end,
                                    currRoute.frequency,
                                    currRoute.isDualBus,
                                    currRoute.routeStatus
                                );
                                // 2. Calculate its next arrival status instantly
                                const nextArrival = getNextArrivalStatus(stopTimes, currRoute.runtime.end);
                                
                                
                                return (
                                <div className='grid grid-cols-[1fr_auto_2.25rem] justify-center items-center mb-5 border-2 border-slate-200 dark:border-slate-700 rounded-lg p-3 gap-2' key={index}>
                                    <div>
                                        <p>{stop.name}</p>
                                        {/*transfer dots live under the name now instead of the fixed-width action column, so a stop with more transfers can't shove the expand button out of alignment with the rows above/below it*/}
                                        {stop.transfer?.available && stop.transfer?.connections?.length > 0 && (
                                            <div id="transfers" className='flex flex-wrap gap-1.5 mt-1'>
                                                {stop.transfer.connections.map((transferColor, tIdx) => (
                                                    <span key={tIdx} className='inline-block rounded-lg h-2 w-2 shrink-0' style={{ backgroundColor: transferColor.trim().toLowerCase() }}></span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className='flex flex-col items-end text-right whitespace-nowrap'>
                                        <p className='text-xs text-slate-400 dark:text-slate-500'>Next Scheduled</p>
                                        <p className='text-sm font-medium'>{nextArrival}</p>
                                    </div>
                                    <button
                                        onClick={() => setExpandedStop(expandedStop === stop.id ? null : stop.id)}
                                        className='rounded-md border-1 h-6 w-6 flex items-center justify-center shrink-0 justify-self-end'
                                    >
                                        {expandedStop === stop.id ? <FontAwesomeIcon icon="fa-solid fa-minus" /> : <FontAwesomeIcon icon="fa-solid fa-plus" />}
                                    </button>
                                    {
                                        expandedStop === stop.id && (
                                            <div className='col-span-3 mt-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-md'>
                                                <h3 className='text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400'>Full Daily Schedule:</h3>
                                                <div className='flex flex-wrap gap-2'>
                                                    {
                                                        stopTimes.map((time, index) => (
                                                            <span key={index} className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded text-sm shadow-xs text-slate-700 dark:text-slate-300'>{time}</span>
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
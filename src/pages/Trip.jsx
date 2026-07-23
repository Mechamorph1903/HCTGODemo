import React from "react";
import { useEffect, useRef, useState, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { db } from '../data/firebase.js'
import { collection, getDocs } from 'firebase/firestore'
import mapboxgl from 'mapbox-gl'
import { stopGrouper, buildTransitGraph, djisktras, getPath, findNearestStop, geocodeAddress, retrievePlace, getWalkingDirections, findStopsWithin, buildTripGraph, getNextDeparture, nodeKey, pathToSegments, buildOption} from '../utils/navigation.js'
import { useDebounce } from "../hooks/debounce.js";

export default function Trip() {
    const [routes, setRoutes] = useState([]) 
    const [allStops, setAllStops] = useState([])
    const [userLocation, setUserLocation] = useState(null)
    const [destination, setDestination] = useState('')
    const [origin, setOrigin] = useState('')
    const [activeInput, setActiveInput] = useState(null)
    const [suggestions, setSuggestions] = useState([])
    const [originCoords, setOriginCoords] = useState(userLocation)
    const [destinationCoords, setDestinationCoords] = useState([])
    const [destinationSelected, setDestinationSelected] = useState(false)
    const [originSelected, setOriginSelected] = useState(false)
    const [tripPath, setTripPath] = useState([])
    const [tripOptions, setTripOptions] = useState([])
    const [selectedOption, setSelectedOption] = useState(null)

    const groupedStops = useMemo(() => stopGrouper(allStops), [allStops])
    const adjacencyList = useMemo(() => buildTransitGraph(groupedStops, routes), [groupedStops, routes])
    const routeLookup = useMemo(() => {
        const map = {}
        for (const r of routes) map[r.id] = r
        return map
    }, [routes])

    const stopLookup = useMemo(() => {
        const map = {}
        for (const s of allStops) map[nodeKey(s.routeId, s.name)] = s
        return map
    }, [allStops])
    
    
    const debouncedOrigin = useDebounce(origin, 400)
    const debouncedDestination = useDebounce(destination, 400)

    const handleSuggestionClick = async (suggestion) => {
         if (activeInput === 'destination') {
            setDestinationSelected(true)
            setDestination(suggestion.name)      // show name in input
            setSuggestions([])                    // close dropdown
            const coords = await retrievePlace(suggestion.mapbox_id)  // get lat/lng
            setDestinationCoords([coords[1], coords[0]])          // store coords for routing
        } else {
            setOriginSelected(true)
            setOrigin(suggestion.name)
            setSuggestions([])
            const coords = await retrievePlace(suggestion.mapbox_id)
            setOriginCoords([coords[1], coords[0]])
        }

    }

    const planTrip = async () =>{
        const effectiveOrigin = originCoords || userLocation
        if (!effectiveOrigin || !destinationCoords.length || !allStops.length || !Object.keys(adjacencyList).length) return

        const nowMin =  new Date().getHours() * 60 + new Date().getMinutes()

        const tripGraph = buildTripGraph(adjacencyList, effectiveOrigin, destinationCoords, allStops)
        const { clock, parents, waitAt } = djisktras(tripGraph, "ORIGIN", nowMin, stopLookup, routeLookup)
        const bestPath = getPath(parents, "DESTINATION")
        const segments = pathToSegments(bestPath)
        const option = await buildOption(segments, clock, nowMin, effectiveOrigin, destinationCoords, stopLookup, routeLookup, waitAt, {id: "fastest", label: "Fastest"})
        setTripPath(segments)
        setTripOptions([option])
        setSelectedOption(option)
        console.log("option", option)
    }
    
    useEffect(() => {
        async function downloadCloudTransitData() {
        try {
            // 1. Fetch Route Metadata
            const routesSnapshot = await getDocs(collection(db, "routes"));
            const cloudRoutes = [];
            routesSnapshot.forEach((doc) => {
            cloudRoutes.push({ id: doc.id, ...doc.data() });
            });
            setRoutes(cloudRoutes);

            // 2. Fetch All Stops
            const stopsSnapshot = await getDocs(collection(db, "stops"));
            const cloudStops = [];
            stopsSnapshot.forEach((doc) => {
            cloudStops.push({ id: doc.id, ...doc.data() });
            });
            setAllStops(cloudStops);

        } catch (error) {
            console.error("Error connecting to Transit Cloud Firestore: ", error);
        
        }
        }

        downloadCloudTransitData();
    }, []);

    //Users Current Location for start point (default)
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
            setUserLocation([position.coords.latitude, position.coords.longitude])
            },
            (error) => {
            console.log('Location denied:', error)
            // fallback to Hattiesburg center
            setUserLocation([31.3271, -89.2903])
            }
        )
    }, [])

    //getting suggestions for points from mapbox
    useEffect(() => {
        //when user selects a suggestion/ it sets destination selected to true preventing geocode from firing again
        if (!debouncedOrigin || originSelected) {
            setOriginSelected(false)
            return
        }

        geocodeAddress(debouncedOrigin).then(res => setSuggestions(res))

    }, [debouncedOrigin])
    
    useEffect(() => {
        //when user selects a suggestion/ it sets destination selected to true preventing geocode from firing again
        if (!debouncedDestination || destinationSelected) {
            setDestinationSelected(false)
            return
        } 

        geocodeAddress(debouncedDestination).then(res => setSuggestions(res))


    }, [debouncedDestination])

    //djikstras for routing
    useEffect(() => {
        planTrip()
    }, [originCoords, destinationCoords, userLocation, adjacencyList])

    //trip drawing
    useEffect(() => {
        if (!map.current || !selectedOption) return
        if (!map.current.isStyleLoaded()) return

        for (let i = 0; i < 20; i++) {
            const id = `trip-seg-${i}`
            if (map.current.getLayer(id)) map.current.removeLayer(id)
            if (map.current.getSource(id)) map.current.removeSource(id)
        }

        selectedOption.segments.forEach((seg, i) => {
            const id = `trip-seg-${i}`
            const coordinates = seg.mode === "walk" ? seg.geometry.coordinates : seg.coords

            const paint = seg.mode === "walk" ? {
                'line-color': '#64748b',
                'line-width': 3,
                'line-dasharray': [2, 2]
                } : {
                'line-color': routeLookup[seg.mode].color,
                'line-width': 5
                }

            map.current.addSource(id, {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: { type: 'LineString', coordinates }
                }
            })

            map.current.addLayer({
                id,
                type: 'line',
                source: id,
                paint
               
            })
        })

        const allCoords = selectedOption.segments.flatMap(seg =>
            seg.mode === "walk" ? seg.geometry.coordinates : seg.coords
        )
        const lngs = allCoords.map(c => c[0])
        const lats = allCoords.map(c => c[1])

        map.current.fitBounds(
            [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
            { padding: 60 }
        )
    }, [selectedOption])



    useEffect(() => {
        const pathStops = tripPath.map(item => allStops.find(s => s.name === item.name && s.routeId === item.routeId)).filter(Boolean)
        // console.log(pathStops)

        const segments = []
        let currId = null
        let prevId = null

        for(const stop of pathStops){
           if(segments.length == 0 || stop.routeId !== segments[segments.length - 1].routeId){
            segments.push({routeId: stop.routeId, stops: []})
           }
           segments[segments.length - 1].stops.push(stop)
        }
        // console.log(segments)
    }, [tripPath])

    //map creation  
    const map = useRef(null)
    const mapContainer = useRef(null)
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

    useEffect(() => {
        if (map.current) return
            map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: userLocation ? [userLocation[1], userLocation[0]] : [-89.2903, 31.3271],
            zoom: 12
            })

            map.current.addControl(new mapboxgl.GeolocateControl({
                positionOptions: { enableHighAccuracy: true },
                trackUserLocation: true,
                showUserHeading: true
            }))
        }, [])


    useEffect(() => {
        if (!map.current || !userLocation) return
        map.current.flyTo({
            center: [userLocation[1], userLocation[0]],
            zoom: 14
        })
    }, [userLocation])

   
  
    


    return(
        <div className="h-full text-black text-xl font-sans antialiased mx-auto shadow-xl p-5">
            <h1 className='text-2xl font-semibold font-black tracking-tight text-slate-900 mb-3'>Where to next?</h1>

            {/* searchBars */}
            <div className="flex flex-col items-center">
                <div className='px-5 pt-4 pb-2 bg-white '>
                    <label htmlFor="origin">From: </label>                
                    <div className='relative flex items-center mb-2'>
                    <div className="absolute left-4 text-slate-400">
                        <FontAwesomeIcon icon="fa-solid fa-map-pin" />
                    </div>
                    <input 
                        type="text" 
                        name="origin" 
                        className='w-full pl-11 pr-24 py-3 bg-slate-100 text-slate-900 placeholder-slate-400 font-medium text-base rounded-2xl border border-transparent focus:outline-none focus:bg-white focus:border-blue-500/50 transition-all shadow-inner' 
                        value={origin}
                        placeholder={userLocation ? "Current Location" : "Getting location..."}
                        onChange={(e) => setOrigin(e.target.value)}
                        onFocus={(e) => {
                            setActiveInput("origin")
                        }}
                    />
                    </div>
                    {suggestions.length > 0 && activeInput == "origin" && (
                        <div className="bg-white rounded-xl shadow-lg mt-1">
                            {suggestions.map((suggestion, i) => (
                            <div 
                                key={i}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="p-3 border-b border-slate-100 cursor-pointer hover:bg-slate-50"
                            >
                                <p className="font-medium text-sm">{suggestion.name}</p>
                                <p className="text-xs text-slate-400">{suggestion.full_address}</p>
                            </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <div>
                    {/* Arrow */}
                    <FontAwesomeIcon icon="fa-solid fa-arrows-up-down" />
                </div>

                <div className='px-5 pt-4 pb-2 bg-white '>
                    <label htmlFor="destination">To: </label>
                    <div className='relative flex items-center mb-2'>
                    <div className="absolute left-4 text-slate-400">
                        <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" className="text-sm" />
                    </div>
                    
                    <input 
                        type="text" 
                        name="destination" 
                        className='w-full pl-11 pr-24 py-3 bg-slate-100 text-slate-900 placeholder-slate-400 font-medium text-base rounded-2xl border border-transparent focus:outline-none focus:bg-white focus:border-blue-500/50 transition-all shadow-inner' 
                        value={destination}
                        placeholder='Search destinations, lines...'
                        onChange={(e) => setDestination(e.target.value)}
                        onFocus={(e) => {
                            setActiveInput("destination")
                        }}
                    />
                    </div>
                    {suggestions.length > 0 && activeInput == "destination" && (
                        <div className="bg-white rounded-xl shadow-lg mt-1">
                            {suggestions.map((suggestion, i) => (
                            <div 
                                key={i}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="p-3 border-b border-slate-100 cursor-pointer hover:bg-slate-50"
                            >
                                <p className="font-medium text-sm">{suggestion.name}</p>
                                <p className="text-xs text-slate-400">{suggestion.full_address}</p>
                            </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Map */}
            <div id="Map" ref={mapContainer} className='h-128 w-110 overflow-hidden rounded-xl' />


        </div>
    )
}
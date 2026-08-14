import React from "react";
import { useEffect, useRef, useState, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { db } from '../data/firebase.js'
import { collection, getDocs } from 'firebase/firestore'
import mapboxgl from 'mapbox-gl'
import { stopGrouper, buildTransitGraph, djisktras, getPath, findNearestStop, geocodeAddress, retrievePlace, getWalkingDirections, findStopsWithin, buildTripGraph, getNextDeparture, nodeKey,nodeKeyOf, pathToSegments, buildOption, edgeBlocker} from '../utils/navigation.js'
import { minutesToTimeInput, minutesToClockString } from "../utils/schedule.js";
import { useDebounce } from "../hooks/debounce.js";
import { useLiveBuses } from "../hooks/busPositions.js";

export default function Trip({ initialDestination, initialDestinationCoords }) {
    const [routes, setRoutes] = useState([]) 
    const [allStops, setAllStops] = useState([])
    const [userLocation, setUserLocation] = useState(null)
    const [destination, setDestination] = useState(initialDestination ?? '')
    const [origin, setOrigin] = useState('')
    const [activeInput, setActiveInput] = useState(null)
    const [suggestions, setSuggestions] = useState([])
    const [originCoords, setOriginCoords] = useState(userLocation)
    const [destinationCoords, setDestinationCoords] = useState(initialDestinationCoords ?? [])
    const [destinationSelected, setDestinationSelected] = useState(false)
    const [originSelected, setOriginSelected] = useState(false)
    const [tripOptions, setTripOptions] = useState({ fastest: [], leastWalking: [], fewestTransfers: [] })
    const [activeObjective, setActiveObjective] = useState("fastest") 
    const [activeIndex, setActiveIndex] = useState(0)          
    const selectedOption = tripOptions[activeObjective]?.[activeIndex] ?? null
    const [expandedSeg, setExpandedSeg] = useState(null)
    const [departAt, setDepartAt] = useState(null)
    const [nowTick, setNowTick] = useState(Date.now())
    const [showTimePicker, setShowTimePicker] = useState(false)
    const [tripStarted, setTripStarted] = useState(false)
    const [activeSegmentIndex, setActiveSegmentIndex] = useState(0)
    const [liveUserLocation, setLiveUserLocation] = useState(null)
    const busPositions = useLiveBuses()

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
    const findShortestPath = (tripGraph, startNode, nowMin, config) => {
        const { clock, parents, cost, waitAt } = djisktras(tripGraph, startNode, nowMin, stopLookup, routeLookup, config)



        if (clock["DESTINATION"] === Infinity) return {bestPath: null, clock: null, cost: null, waitAt: null}

        const bestPath = getPath(parents, "DESTINATION")

        return { bestPath ,clock, cost, waitAt  }
    }




    const planOne = async (tripGraph, nowMin, effectiveOrigin, config, meta) =>{
        const { bestPath, clock, waitAt } = findShortestPath(tripGraph, "ORIGIN", nowMin, config)

        if (bestPath === null) return { bestPath: null, option: null }

        const segments = pathToSegments(bestPath)
        const option = await buildOption(segments, clock, nowMin, effectiveOrigin, destinationCoords, stopLookup, routeLookup, waitAt, meta)

        return {bestPath, option}
        
    }

    const findKShortestPaths = async (tripGraph, effectiveOrigin, nowMin, config, k = 3) => {
        const first = findShortestPath(tripGraph, "ORIGIN", nowMin, config)
        if (first.bestPath === null) return []

        const A = [first]   // accepted paths so far, each: { bestPath, clock, cost, waitAt }

        while (A.length < k) {
            const prevPath = A[A.length - 1].bestPath

            // segment boundaries only — where the outgoing mode changes from the
            // previous node's outgoing mode. Index 0 (ORIGIN) always counts.
            const boundaryIndices = [0]
            for (let i = 1; i < prevPath.length - 1; i++) {
                if (prevPath[i].routeId !== prevPath[i - 1].routeId) boundaryIndices.push(i)
            }

            const candidates = []

            for (const i of boundaryIndices) {
                const spurNode = prevPath[i]
                const spurKey = nodeKeyOf(spurNode)
                const rootPath = prevPath.slice(0, i + 1)

                const blockedEdges = edgeBlocker(rootPath, A.map(p => p.bestPath))
                const spurConfig = { ...config, blockedEdges }

                const nowAtSpur = A[A.length - 1].clock[spurKey]
                const spurResult = findShortestPath(tripGraph, spurKey, nowAtSpur, spurConfig)
                if (spurResult.bestPath === null) continue

                const fullPath = rootPath.slice(0, -1).concat(spurResult.bestPath)
                const mergedClock = { ...A[A.length - 1].clock, ...spurResult.clock }
                const mergedWaitAt = { ...A[A.length - 1].waitAt, ...spurResult.waitAt }

                const spurBaseCost = A[A.length - 1].cost[spurKey]
                const adjustedSpurCost = {}
                for (const key in spurResult.cost) {
                    adjustedSpurCost[key] = spurBaseCost + spurResult.cost[key]
                }
                const mergedCost = { ...A[A.length - 1].cost, ...adjustedSpurCost }
                const totalCost = mergedCost["DESTINATION"]

                candidates.push({ bestPath: fullPath, clock: mergedClock, cost: mergedCost, waitAt: mergedWaitAt, totalCost })
            }

            const pathSignature = (path) => path.map(nodeKeyOf).join("|")
            const seen = new Set(A.map(p => pathSignature(p.bestPath)))
            const fresh = candidates.filter(c => !seen.has(pathSignature(c.bestPath)))

            if (fresh.length === 0) break

            fresh.sort((a, b) => a.totalCost - b.totalCost)
            A.push(fresh[0])
        }

        // format every accepted path into a real display-ready option
        const options = []
        for (let i = 0; i < A.length; i++) {
            const segments = pathToSegments(A[i].bestPath)
            const option = await buildOption(
                segments, A[i].clock, nowMin, effectiveOrigin, destinationCoords,
                stopLookup, routeLookup, A[i].waitAt,
                { id: `alt${i}`, label: i === 0 ? "Best route" : `Alternative ${i}` }
            )
            options.push(option)
        }

        return options
    }

    const planTrip = async () => {
        const effectiveOrigin = originCoords || userLocation
        if (!effectiveOrigin || !destinationCoords.length || !allStops.length || !Object.keys(adjacencyList).length) return

        let nowMin = departAt ?? (new Date().getHours() * 60 + new Date().getMinutes())
        const actualNow = new Date().getHours() * 60 + new Date().getMinutes()
        if (departAt !== null && departAt < actualNow) nowMin = departAt + 1440
        const tripGraph = buildTripGraph(adjacencyList, effectiveOrigin, destinationCoords, allStops)

        const [fastestOptions, leastWalkingResult, fewestTransfersResult] = await Promise.all([
            findKShortestPaths(tripGraph, effectiveOrigin, nowMin, { walkPenalty: 2.5, transferPenalty: 0 }, 3),
            planOne(tripGraph, nowMin, effectiveOrigin, { walkPenalty: 10, transferPenalty: 0 }, { id: "leastWalking", label: "Least walking" }),
            planOne(tripGraph, nowMin, effectiveOrigin, { walkPenalty: 2.5, transferPenalty: 20 }, { id: "fewestTransfers", label: "Fewest transfers" }),
        ])

        setTripOptions({
            fastest: fastestOptions,
            leastWalking: leastWalkingResult.option ? [leastWalkingResult.option] : [],
            fewestTransfers: fewestTransfersResult.option ? [fewestTransfersResult.option] : [],
        })
        setActiveObjective("fastest")
        setActiveIndex(0)
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
    }, [originCoords, destinationCoords, userLocation, adjacencyList, departAt])


    // tick every 30s so countdowns re-render
    useEffect(() => {
        const t = setInterval(() => setNowTick(Date.now()), 30000)
        return () => clearInterval(t)
    }, [])

    // re-plan if the first bus has departed
    useEffect(() => {
        if (departAt !== null || !selectedOption) return
        const firstBus = selectedOption.segments.find(s => s.mode !== "walk")
        if (!firstBus) return
        const nowM = new Date().getHours() * 60 + new Date().getMinutes()
        if (nowM > firstBus.departsAtMin) planTrip()
    }, [nowTick])

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

   
  
    



    //RT Navigation
    useEffect(() => {
        if (!tripStarted) return
        const watchId = navigator.geolocation.watchPosition(
            (position) => setLiveUserLocation([position.coords.latitude, position.coords.longitude]),
            (error) => console.log('Live tracking error:', error),
            { enableHighAccuracy: true }
        )
        return () => navigator.geolocation.clearWatch(watchId)
    }, [tripStarted])

    return(
        <div className="h-full text-black dark:text-white text-xl font-sans antialiased mx-auto shadow-xl p-5">
            <div className='flex items-center gap-3 mb-5'>
                <div className='h-11 w-11 shrink-0 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-500 dark:text-blue-400'>
                    <FontAwesomeIcon icon="fa-solid fa-route" />
                </div>
                <div>
                    <h1 className='text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight'>Where to next?</h1>
                    <p className='text-sm text-slate-400 dark:text-slate-500'>Plan a trip across Hattiesburg</p>
                </div>
            </div>

            {/* searchBars */}
            <div className="flex flex-col items-center">
                <div className='px-5 pt-4 pb-2 bg-white dark:bg-slate-900 '>
                    <label htmlFor="origin" className='block mb-1.5 text-sm font-medium text-slate-500 dark:text-slate-400'>From: </label>
                    <div className='relative flex items-center mb-2'>
                    <div className="absolute left-4 text-slate-400 dark:text-slate-500">
                        <FontAwesomeIcon icon="fa-solid fa-map-pin" />
                    </div>
                    <input
                        type="text"
                        name="origin"
                        className='w-full pl-11 pr-24 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium text-base rounded-2xl border border-transparent focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500/50 transition-all shadow-inner'
                        value={origin}
                        placeholder={userLocation ? "Current Location" : "Getting location..."}
                        onChange={(e) => setOrigin(e.target.value)}
                        onFocus={(e) => {
                            setActiveInput("origin")
                        }}
                    />
                    </div>
                    {suggestions.length > 0 && activeInput == "origin" && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg mt-1">
                            {suggestions.map((suggestion, i) => (
                            <div
                                key={i}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="p-3 border-b border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                <p className="font-medium text-sm">{suggestion.name}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">{suggestion.full_address}</p>
                            </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className='py-1.5 text-slate-400 dark:text-slate-500'>
                    {/* Arrow */}
                    <FontAwesomeIcon icon="fa-solid fa-arrows-up-down" />
                </div>

                <div className='px-5 pt-4 pb-2 bg-white dark:bg-slate-900 '>
                    <label htmlFor="destination" className='block mb-1.5 text-sm font-medium text-slate-500 dark:text-slate-400'>To: </label>
                    <div className='relative flex items-center mb-2'>
                    <div className="absolute left-4 text-slate-400 dark:text-slate-500">
                        <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" className="text-sm" />
                    </div>

                    <input
                        type="text"
                        name="destination"
                        className='w-full pl-11 pr-24 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium text-base rounded-2xl border border-transparent focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500/50 transition-all shadow-inner'
                        value={destination}
                        placeholder='Search destinations, lines...'
                        onChange={(e) => setDestination(e.target.value)}
                        onFocus={(e) => {
                            setActiveInput("destination")
                        }}
                    />
                    </div>
                    {suggestions.length > 0 && activeInput == "destination" && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg mt-1">
                            {suggestions.map((suggestion, i) => (
                            <div
                                key={i}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="p-3 border-b border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                <p className="font-medium text-sm">{suggestion.name}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">{suggestion.full_address}</p>
                            </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* ArriveType */}
            <button
                onClick={() => setShowTimePicker(!showTimePicker)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium mt-3"
            >
                <FontAwesomeIcon icon="fa-solid fa-clock" className="text-slate-400 dark:text-slate-500" />
                {departAt === null ? "Leave now" : `Leave at ${minutesToClockString(departAt)}`}
                <FontAwesomeIcon icon="fa-solid fa-chevron-down" className="text-xs text-slate-400 dark:text-slate-500" />
            </button>

            {showTimePicker && (
                <div className="mt-2 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col gap-3">
                    <button
                        onClick={() => { setDepartAt(null); setShowTimePicker(false) }}
                        className={`text-left text-sm font-medium ${departAt === null ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"}`}
                    >
                        Leave now
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-700 dark:text-slate-300">Leave at</span>
                        <input
                            type="time"
                            value={departAt === null ? "" : minutesToTimeInput(departAt)}
                            onChange={(e) => {
                                if (!e.target.value) return
                                const [h, m] = e.target.value.split(":").map(Number)
                                setDepartAt(h * 60 + m)
                            }}
                            className="bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2 text-sm"
                        />
                    </div>
                </div>
            )}

            {/* Map */}
            <div id="Map" ref={mapContainer} className='h-128 w-full overflow-hidden rounded-xl mt-4' />

            {/* Options */}
                {/* Objective dropdown */}
                    {(tripOptions.fastest.length > 0 || tripOptions.leastWalking.length > 0 || tripOptions.fewestTransfers.length > 0) && (
                        <select
                            value={activeObjective}
                            onChange={(e) => {
                                setActiveObjective(e.target.value)
                                setActiveIndex(0)
                                setExpandedSeg(null)
                            }}
                            className="bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 text-sm font-medium mt-4"
                        >
                            <option value="fastest">Fastest</option>
                            <option value="leastWalking">Least walking</option>
                            <option value="fewestTransfers">Fewest transfers</option>
                        </select>
                    )}

                    {/* Pills for whichever objective is active */}
                    {tripOptions[activeObjective]?.length > 0 ? (
                        <div className="flex gap-2 mt-3 overflow-x-auto">
                            {tripOptions[activeObjective].map((opt, i) => {
                                const routes = [...new Set(opt.segments.filter(s => s.mode !== "walk").map(s => s.mode))]
                                    .map(m => routeLookup[m]?.name ?? m)   // adjust ?? fallback to whatever field your route objects actually use

                                return (
                                    <button
                                        key={opt.id ?? i}
                                        onClick={() => {
                                            setActiveIndex(i)
                                            setExpandedSeg(null)
                                        }}
                                        className={`flex flex-col items-start px-4 py-3 rounded-2xl border shrink-0 transition-colors ${
                                            activeIndex === i
                                                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                                                : 'bg-white text-slate-900 border-slate-200 dark:bg-slate-800 dark:text-white dark:border-slate-700'
                                        }`}
                                    >
                                        <span className="text-xs font-medium opacity-70">
                                            {tripOptions[activeObjective].length > 1 ? `Route ${i + 1}` : opt.label}
                                        </span>
                                        <span className="text-lg font-bold leading-tight">{opt.totalMin} min</span>
                                        <span className="text-xs opacity-70">{routes.length ? routes.join(", ") : "Walk only"}</span>
                                    </button>
                                )
                            })}
                        </div>
                    ) : (
                        tripOptions.fastest.length + tripOptions.leastWalking.length + tripOptions.fewestTransfers.length > 0 && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">No route found for this option.</p>
                        )
                    )}

                    {selectedOption && (
                        <div className="mt-6 flex flex-col gap-3">
                            {selectedOption.segments.map((seg, i) => (
                                <div key={i} className="flex flex-col">

                                    {seg.mode === "walk" ? (
                                        <>
                                            <button
                                                onClick={() => setExpandedSeg(expandedSeg === i ? null : i)}
                                                className="flex items-center gap-3 text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                                            >
                                                <FontAwesomeIcon icon="fa-solid fa-person-walking" className="text-slate-400 dark:text-slate-500" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Walk {seg.minutes} min</p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500">to {seg.to === "DESTINATION" ? "your destination" : seg.to}</p>
                                                </div>
                                                <FontAwesomeIcon icon={expandedSeg === i ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"} className="text-slate-300 dark:text-slate-600 text-xs" />
                                            </button>
                                            {expandedSeg === i && seg.steps && (
                                                <ol className="mt-2 ml-6 flex flex-col gap-1">
                                                    {seg.steps.map((step, j) => (
                                                        <li key={j} className="text-xs text-slate-500 dark:text-slate-400">
                                                            {step.instruction}
                                                            {step.distance > 0 && <span className="text-slate-300 dark:text-slate-600"> · {step.distance}m</span>}
                                                        </li>
                                                    ))}
                                                </ol>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900">
                                                <FontAwesomeIcon icon="fa-solid fa-clock" className="text-amber-500" />
                                                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                                    {departAt !== null
                                                        ? `Wait ${seg.waitMin} min — departs ${seg.departsAt}`
                                                        : (() => {
                                                            const nowM = new Date().getHours() * 60 + new Date().getMinutes()
                                                            const mins = Math.round(seg.departsAtMin - nowM)
                                                            return mins <= 0
                                                                ? `Departing now — ${seg.departsAt}`
                                                                : `Wait ${mins} min — departs ${seg.departsAt}`
                                                        })()
                                                    }
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setExpandedSeg(expandedSeg === i ? null : i)}
                                                className="flex items-center gap-3 p-3 mt-2 rounded-xl border w-full text-left"
                                                style={{ borderColor: routeLookup[seg.mode]?.color }}
                                            >
                                                <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: routeLookup[seg.mode]?.color }} />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">
                                                        {routeLookup[seg.mode]?.name} Route · {seg.minutes} min
                                                    </p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                                        {seg.stops.length - 1} stops to {seg.alightStop}
                                                    </p>
                                                </div>
                                                <FontAwesomeIcon icon={expandedSeg === i ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"} className="text-slate-300 dark:text-slate-600 text-xs" />
                                            </button>
                                            {expandedSeg === i && (
                                                <ol className="mt-2 ml-6 flex flex-col gap-1 border-l-2 pl-4" style={{ borderColor: routeLookup[seg.mode]?.color }}>
                                                    {seg.stops.map((s, j) => (
                                                        <li key={j} className="text-xs text-slate-500 dark:text-slate-400">
                                                            {s.name}
                                                            {j === 0 && <span className="text-slate-300 dark:text-slate-600"> · board here</span>}
                                                            {j === seg.stops.length - 1 && <span className="text-slate-300 dark:text-slate-600"> · get off</span>}
                                                        </li>
                                                    ))}
                                                </ol>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* {selectedOption && !tripStarted && (
                        <button
                            onClick={() => setTripStarted(true)}
                            className="mt-4 w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold"
                        >
                            Start Trip
                        </button>
                    )} */}


        </div>
    )
}
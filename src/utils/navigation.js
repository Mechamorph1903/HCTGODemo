import { minutesToClockString } from "./schedule"



//buckets every stop by its route color and sorts each bucket by stop order, so the graph builder can walk each route in sequence
export const stopGrouper = (stops) => {
    const grouped = {
      blue: [],
      gold: [],
      purple: [],
      red: [],
      orange: [],
      green: [],
      brown: []
    }

    for(const stop of stops){
      grouped[stop.routeId].push(stop)
    }

    for(const routeId in grouped){
      grouped[routeId].sort((a,b) => a.stopNum - b.stopNum)
    }

    return grouped
  }


//graph nodes are keyed by "routeId::stopName" so the same physical stop on two different routes gets two distinct nodes
export const nodeKey = (routeId, name) => `${routeId}::${name}`

export const nodeKeyOf = (node) => node.stopRoute ? nodeKey(node.stopRoute, node.name) : node.name

//dual-bus routes run two buses on the same loop, so riders effectively see half the posted frequency
export const effectiveHeadway = (route) =>
	route.isDualBus ? route.frequency[0]/ 2 : route.frequency[0]


//given when a stop's first/last bus of the day passes and the current time, finds the next actual departure minute (handles wrapping past midnight into the next day's first pass)
export const getNextDeparture = (firstPassMin, frequency, currentMin, lastPassMin) => {
	const dayOffset = Math.floor(currentMin / 1440) * 1440
    const localNow = currentMin - dayOffset

    if (localNow <= firstPassMin) return dayOffset + firstPassMin

    const elapsed = localNow - firstPassMin
    const k = Math.ceil(elapsed / frequency)
    const next = firstPassMin + k * frequency

    if (next > lastPassMin) return dayOffset + 1440 + firstPassMin

    return dayOffset + next

}



//convenience wrapper around getNextDeparture for a specific route/stop pair
export const stopDeparture = (route, stop, currentMin) => {
	const firstPassMin = route.runtime.start + stop.minuteOffset
	const headway = effectiveHeadway(route)
	const lastPassMin = route.runtime.end + stop.minuteOffset
	

	return getNextDeparture(firstPassMin, headway, currentMin, lastPassMin)
}



//builds the adjacency list dijkstra's runs over: each stop links to the next stop on its own route (with the loop wrapping the last stop back to the first), plus "transfer edges" connecting stops on different routes that share the same physical location
export const buildTransitGraph = (groupedStops, routes) => {
	const adjacencyList = {}


	for(const route in groupedStops){
		const stops = groupedStops[route]
		stops.forEach((stop, index) => {
			const nextStop = stops[index + 1]
			const key = nodeKey(stop.routeId, stop.name)

			if (!adjacencyList[key]) adjacencyList[key] = []

			if (nextStop) {
				adjacencyList[key].push({
					to: nodeKey(nextStop.routeId, nextStop.name),
					weight: nextStop.minuteOffset - stop.minuteOffset,
					routeId: route
				})
			}
		})

		const firstStop = stops[0]
		const lastStop = stops[stops.length - 1]
		if (firstStop && lastStop && firstStop !== lastStop) {
			const routeObj = routes.find(r => r.id === firstStop.routeId)
			const loopDuration = routeObj.frequency[0]
			const wrapWeight = loopDuration - lastStop.minuteOffset
			adjacencyList[nodeKey(lastStop.routeId, lastStop.name)].push({
				to: nodeKey(firstStop.routeId, firstStop.name),
				weight: wrapWeight > 0 ? wrapWeight : 1,
				routeId: lastStop.routeId
			})
		}
	}

	//transfer edges - connect same-named stops across different routes so riders can switch buses there
	for(const route in groupedStops){
		let stops = groupedStops[route]

		for(const stop of stops){
			if(stop.transfer.available === true){
				for(const connectedRoute of stop.transfer.connections){
						let connectedStops = groupedStops[connectedRoute.toLowerCase().trim()]
						if(!connectedStops) {
						console.log('Missing route in groupedStops:', connectedRoute)
						continue
						}
						if (!connectedStops) continue  // skip if route doesn't exist in groupedStops

						for(const stopsInner of connectedStops){
							const cleanName = (name) => name.replace(/\s*\(return\)/i, '').trim()
							if(cleanName(stop.name) === cleanName(stopsInner.name)){
								const connectingRoute = routes.find(r => r.id === connectedRoute.toLowerCase().trim())
								if (!connectingRoute) continue

								const freq = effectiveHeadway(connectingRoute)
								const weight = freq / 2

								const fromKey = nodeKey(stop.routeId, stop.name)
								const toKey   = nodeKey(stopsInner.routeId, stopsInner.name)

								if (fromKey === toKey) continue

								if (!adjacencyList[fromKey]) adjacencyList[fromKey] = []
								if (!adjacencyList[toKey]) adjacencyList[toKey] = []

								if (!adjacencyList[fromKey].some(e => e.to === toKey)) {
									adjacencyList[fromKey].push({ to: toKey, weight, routeId: connectingRoute.id })
								}
								if (!adjacencyList[toKey].some(e => e.to === fromKey)) {
									adjacencyList[toKey].push({ to: fromKey, weight, routeId: stop.routeId })
								}
							}
						}

				}


			}
		}
	}
	return adjacencyList
}

//walks dijkstra's `parent` map backwards from target to start to rebuild the actual route, then turns the "routeId::stopName" keys back into {name, stopRoute, routeId} stop objects
export const getPath = (parent, target) => {
    const pathArr = [{ key: target, routeId: parent[target]?.routeId }]
	const seen = new Set([target])
    let curr = parent[target]
    while (curr) {
		if (seen.has(curr.name)) {
            console.warn("Cycle detected in path reconstruction at", curr.name)
            break
        }
        seen.add(curr.name)
        pathArr.push({ key: curr.name, routeId: curr.routeId })
        curr = parent[curr.name]
    }
    return pathArr.reverse().map(item => {
        const [routePart, ...rest] = item.key.split("::")
        return rest.length
            ? { name: rest.join("::"), stopRoute: routePart, routeId: item.routeId }
            : { name: item.key, stopRoute: null, routeId: item.routeId }
    })
}

//time-dependent dijkstra's: cost isn't just distance, it factors in wait time for the next bus, a walk penalty, and an optional transfer penalty.
//`config.blockedEdges` lets us block edges the best path already used so a second run is forced to find a genuinely different route (this is how the k-shortest-path alternatives get generated, see edgeBlocker below)
export const djisktras = (graph,start, nowMin, stopLookup, routeLookup, config = {}) => {
	const walkPenalty = config.walkPenalty ?? 2.5
    const transferPenalty = config.transferPenalty ?? 0
    const arrivedVia = {}
	const clock = {}
	const cost = {}
	const waitAt = {}
    const parents = {}
    const visited = new Set()

    for (const node in graph) {clock[node] = Infinity; cost[node] = Infinity}

	clock[start] =  nowMin
	cost[start] = 0
	arrivedVia[start] = "walk"

    while(true){
        let minNode = null

        for(const node in clock){
            if(visited.has(node)) continue
            if(minNode == null || cost[node] < cost[minNode]) minNode = node
        }

        if(minNode === null || cost[minNode] === Infinity) break

		if (!graph[minNode]) {
			visited.add(minNode)
			continue
		}

        for (const edge of graph[minNode]) {
			const edgeKey = `${minNode}->${edge.to}`
    		if (config.blockedEdges?.has(edgeKey)) continue

			let newClock, newCost
			let thisEdgeWait = 0                      

			if (edge.routeId === "walk") {
				newClock = clock[minNode] + edge.weight
				newCost  = cost[minNode]  + edge.weight * walkPenalty

			} else if (arrivedVia[minNode] === edge.routeId) {
				newClock = clock[minNode] + edge.weight
				newCost  = cost[minNode]  + edge.weight

			} else {
				const stop = stopLookup[minNode]
				const route = routeLookup[edge.routeId]
				if (!stop || !route) continue
				const departure = stopDeparture(route, stop, clock[minNode])
				const wait = departure - clock[minNode]
				thisEdgeWait = wait                    // ← add
				newClock = departure + edge.weight
				newCost  = cost[minNode] + wait + edge.weight + transferPenalty
			}

			if (newCost < cost[edge.to]) {
				cost[edge.to] = newCost
				clock[edge.to] = newClock
				parents[edge.to] = { name: minNode, routeId: edge.routeId }
				arrivedVia[edge.to] = edge.routeId
				waitAt[edge.to] = thisEdgeWait         // ← add
			}
		}
        visited.add(minNode)
    }

    return {clock, cost, parents, arrivedVia, waitAt}
}


export function findNearestStop(lat, lng, allStops){
	let minimumDistance = Infinity
	let closestStop = null
	for(const stop of allStops){
		//The formula for distance between two lat/lng coordinates is called the Haversine formula — it accounts for the curvature of the Earth. 
		//But for short distances within a city, a simpler approximation works fine. It's not perfectly accurate in miles but it correctly identifies which stop is closest
		const distance = Math.sqrt((stop.coords[0] - lat) * (stop.coords[0] - lat) + (stop.coords[1] - lng) * (stop.coords[1] - lng))
		if (distance < minimumDistance) {
			minimumDistance = distance
			closestStop = stop
		}
	}

	return closestStop
}

const sessionToken = crypto.randomUUID(); //keeps a search's suggest->retrieve calls billed as one session with mapbox

//address/POI autocomplete via mapbox search box, biased toward hattiesburg
export const geocodeAddress = async (searchText) => {
	const url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(searchText)}&session_token=${sessionToken}&proximity=-89.2903,31.3271&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}&limit=5&country=US&types=address,poi,place`
	try {
    const data = await fetch(url);
    const res = await data.json();
    return res.suggestions || [];
  } catch (error) {
    console.error("Geocoding fetch failed:", error);
    return [];
  }
}

//once the rider picks a suggestion from geocodeAddress, this resolves it to actual coordinates
export const retrievePlace = async (suggestion_id) => {
	const url = `https://api.mapbox.com/search/searchbox/v1/retrieve/${suggestion_id}?session_token=${sessionToken}&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
	try {
    const data = await fetch(url);
    const res = await data.json();
	
    return res.features[0].geometry.coordinates || [];
  } catch (error) {
    console.error("Geocoding fetch failed:", error);
    return [];
  }
}

//pulls turn-by-turn walking directions from mapbox for the walk portions of a trip (walk to first stop, transfers, walk from last stop to destination)
export const getWalkingDirections =  async (originCoords, destCoords) => {
	//[lng,lat]
	const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${originCoords[1]},${originCoords[0]};${destCoords[1]},${destCoords[0]}?alternatives=true&steps=true&geometries=geojson&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
	try {
		const data = await fetch(url);
		const res = await data.json();
		const duration = Math.round(res.routes[0].duration / 60)
		const geometry = res.routes[0].geometry
		const steps = res.routes[0].legs[0].steps.map(s => ({
				instruction: s.maneuver.instruction,
				distance: Math.round(s.distance),
				duration: Math.round(s.duration / 60)
			}))

		
		return { duration, geometry, steps }|| [];
	} catch (error) {
		console.error("Walking directions fetch failed:", error);
		return [];
	}
}

//finds every stop within maxMeters of a point (flat-earth approximation, fine at city scale) - used to find candidate boarding/alighting stops near the origin and destination
export const findStopsWithin = (lat, lng, allStops, maxMeters = 1000) => {
	const results = []
	for (const stop of allStops){
		const latMeters = (stop.coords[0] - lat) * 111000
		const lngMeters = (stop.coords[1] - lng) * 94800
		const distance = Math.sqrt(latMeters * latMeters + lngMeters * lngMeters)

		if (distance < maxMeters){
			results.push({stop: stop, distance: distance })
		}
	}

	return results

}

//rough conversion assuming an average walking pace, used to weight walk edges in minutes like everything else in the graph
export const metersToWalkMinutes = (meters) => (meters * 1.3) / 83

//clones the base transit graph and grafts on temporary ORIGIN/DESTINATION nodes wired to nearby stops (plus a direct walk edge between them), so dijkstra's can be run for this specific trip without mutating the shared graph
export const buildTripGraph = (baseGraph, originCoords, destCoords, allStops) => {
	const graph = {}
	for (const node in baseGraph) {
		graph[node] = [...baseGraph[node]]
	}
	graph["ORIGIN"] = []
	graph["DESTINATION"] = []

	const resultsOrigin =  findStopsWithin(originCoords[0], originCoords[1], allStops)
	const resultsDestination =  findStopsWithin(destCoords[0], destCoords[1], allStops)
	

	for (const item of resultsOrigin) {
		const key = nodeKey(item.stop.routeId, item.stop.name)
		if (!graph[key]) continue

		const weight = metersToWalkMinutes(item.distance)
		graph["ORIGIN"].push({ to: key, weight, routeId: "walk" })
		graph[key].push({ to: "ORIGIN", weight, routeId: "walk" })
	}

	for (const item of resultsDestination) {
		const key = nodeKey(item.stop.routeId, item.stop.name)
		if (!graph[key]) continue

		const weight = metersToWalkMinutes(item.distance)
		graph["DESTINATION"].push({ to: key, weight, routeId: "walk" })
		graph[key].push({ to: "DESTINATION", weight, routeId: "walk" })
	}

	const latMeters = (destCoords[0] - originCoords[0]) * 111000
	const lngMeters = (destCoords[1] - originCoords[1]) * 94800
	const directMeters = Math.sqrt(latMeters * latMeters + lngMeters * lngMeters)
	const directWalkWeight = metersToWalkMinutes(directMeters)
	graph["DESTINATION"].push({ to: "ORIGIN", weight: directWalkWeight, routeId: "walk" })
	graph["ORIGIN"].push({ to: "DESTINATION", weight: directWalkWeight, routeId: "walk" })

	return graph	
}

//collapses a raw stop-by-stop path into contiguous ride/walk segments - consecutive stops on the same route (or consecutive walk hops) get merged into one segment instead of staying as individual edges
export const pathToSegments = (path) => {
    const segments = []

    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i]
        const to = path[i + 1]
        const mode = from.routeId          // mode of THIS edge

        const last = segments[segments.length - 1]

        if (last && last.mode === mode) {
            // extend current segment
            last.stops.push(to)
        } else {
            // start a new segment
            segments.push({
                mode,                       // "walk" or a routeId
                stops: [from, to],
            })
        }
    }

    return segments
}


//fills each segment in with the actual display data (walking geometry/steps, board/alight stop, wait time, departure clock) and packages the whole thing into one trip "option" for the UI
export const buildOption = async (segments, clock, nowMin, originCoords, destinationCoords, stopLookup, routeLookup, waitAt, meta) => {
	const resolveCoord = (node) => {
		if (node.name === "ORIGIN") return [originCoords[1], originCoords[0]]
		if (node.name === "DESTINATION") return [destinationCoords[1], destinationCoords[0]]
		const stop = stopLookup[nodeKey(node.stopRoute, node.name)]
		return [stop.coords[1], stop.coords[0]]   // lng, lat
	}


	for (const seg of segments) {
		const first = seg.stops[0]
		const last = seg.stops[seg.stops.length - 1]

		if (seg.mode === "walk") {
			const a = resolveCoord(first)   // [lng, lat]
			const b = resolveCoord(last)
			const { duration, geometry, steps } = await getWalkingDirections([a[1], a[0]], [b[1], b[0]])
			// attach from, to, minutes, geometry to seg
				seg.from =  first.name
				seg.to = last.name
				seg.minutes = duration
				seg.geometry = geometry
				seg.steps = steps
		} else {
			const board = stopLookup[nodeKey(first.stopRoute, first.name)]
			const alight = stopLookup[nodeKey(last.stopRoute, last.name)]
			let duration = alight.minuteOffset - board.minuteOffset
			if(duration < 0){
				const route = routeLookup[seg.mode]
				duration += route.frequency[0]
			}
			const coords = seg.stops.map(resolveCoord)

			seg.boardStop = first.name
			seg.alightStop = last.name
			seg.minutes = duration
			seg.coords = coords

			const secondStop = seg.stops[1]
			const waitRaw = secondStop
				? (waitAt[nodeKey(secondStop.stopRoute, secondStop.name)] || 0)
				: 0
			const boardClock = clock[nodeKey(first.stopRoute, first.name)]

			seg.waitMin = Math.round(waitRaw)
			seg.departsAt = minutesToClockString(boardClock + waitRaw)
			seg.departsAtMin = boardClock + waitRaw 

		}
	}

	return {
		id: meta.id,
		label: meta.label,
		totalMin: Math.round(clock["DESTINATION"] - nowMin),
		arriveBy: minutesToClockString(clock["DESTINATION"]),
		segments
	}

}

//for k-shortest-path alternatives: compares the best (root) path against paths we've already accepted and picks the edge where they diverge, so we can block it and force the next dijkstra's run down a different route
export const edgeBlocker = (rootPath, acceptedPaths) => {
	let match = 0
	const blockedEdges = new Set()
	const rootKeys = rootPath.map(nodeKeyOf)

		for(let i = 0; i < acceptedPaths.length; i++){
			const pathKeys = acceptedPaths[i].map(nodeKeyOf)
			for(let j = 0; j< pathKeys.length; j++){
				if(match >= rootKeys.length){
					blockedEdges.add(`${rootKeys[j-1]}->${pathKeys[j]}`)
					break
				}
				if(rootKeys[j] === pathKeys[j]){
					match += 1
				}
				
				
			}
			match = 0
		}

	return blockedEdges
}

// top-N nearest stops by raw distance, not just the single closest —
// needed because return-stop pairs sit at ~identical coordinates
export function findNearestStops(lat, lng, allStops, n = 3) {
    return [...allStops]
        .map(stop => ({
            stop,
            distance: Math.sqrt((stop.coords[0] - lat) ** 2 + (stop.coords[1] - lng) ** 2)
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, n)
        .map(entry => entry.stop)
}

// how far (in minutes) the current time sits from this stop's nearest scheduled pass —
// checks both the upcoming departure and one headway earlier, since "closest pass" could be either
export const scheduleAlignment = (route, stop, nowMin) => {
    const nextDeparture = stopDeparture(route, stop, nowMin)
    const headway = effectiveHeadway(route)
    const prevDeparture = nextDeparture - headway
    return Math.min(Math.abs(nextDeparture - nowMin), Math.abs(prevDeparture - nowMin))
}

export const buildLineCoords = (route, routeStops) => {
    // prefer the hand-traced shape once it exists
    if (route.shapePoints?.length) {
        return route.shapePoints.map(p => [p.lng, p.lat])
    }
    // fallback: straight lines through stops, manually closed —
    // only hit if a route somehow has no shapePoints yet
    const coords = routeStops.map(stop => [stop.coords[1], stop.coords[0]])
    if (routeStops.length > 1) coords.push(coords[0])
    return coords
}
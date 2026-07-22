const WALK_PENALTY = 2.5


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


export const nodeKey = (routeId, name) => `${routeId}::${name}`

export const effectiveHeadway = (route) =>
	route.isDualBus ? route.frequency[0]/ 2 : route.frequency[0]


export const getNextDeparture = (firstPassMin, frequency, currentMin, lastPassMin) => {
	if(currentMin <= firstPassMin){
		return firstPassMin
	}

	const elapsed = currentMin - firstPassMin
	const k = Math.ceil(elapsed/frequency)
	const nextDeparture = firstPassMin + (k*frequency)

	
	if(nextDeparture > lastPassMin){
		return firstPassMin + 1440
	}
	

	return nextDeparture

}



export const stopDeparture = (route, stop, currentMin) => {
	const firstPassMin = route.runtime.start + stop.minuteOffset
	const headway = effectiveHeadway(route)
	const lastPassMin = route.runtime.end + stop.minuteOffset
	

	return getNextDeparture(firstPassMin, headway, currentMin, lastPassMin)
}



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

	//transfer edges

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

export const getPath = (parent, target) => {
    const pathArr = [{ key: target, routeId: parent[target]?.routeId }]
    let curr = parent[target]
    while (curr) {
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

export const djisktras = (graph,start, nowMin, stopLookup, routeLookup) => {
    const arrivedVia = {}
	const clock = {}
	const cost = {}
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

        for(const edge of graph[minNode]){
            let newClock, newCost

			if (edge.routeId === "walk") {
				newClock = clock[minNode] + edge.weight
        		newCost  = cost[minNode]  + edge.weight * WALK_PENALTY

			} else if (arrivedVia[minNode] === edge.routeId) {
				newClock = clock[minNode] + edge.weight
        		newCost  = cost[minNode]  + edge.weight

			} else {
				const stop = stopLookup[minNode]
				const route = routeLookup[edge.routeId]
				if (!stop || !route) continue
				const departure = stopDeparture(route, stop, clock[minNode])
				const wait = departure - clock[minNode]
				newClock = departure + edge.weight
        		newCost  = cost[minNode] + wait + edge.weight
			}

			if (newCost < cost[edge.to]) {
				cost[edge.to] = newCost
				clock[edge.to] = newClock
				parents[edge.to] = { name: minNode, routeId: edge.routeId }
				arrivedVia[edge.to] = edge.routeId
			}

        }
        visited.add(minNode)
    }

    return {clock, cost, parents, arrivedVia}
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

const sessionToken = crypto.randomUUID();

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

export const getWalkingDirections =  async (originCoords, destCoords) => {
	const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${originCoords[1]},${originCoords[0]};${destCoords[1]},${destCoords[0]}?alternatives=true&geometries=geojson&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
	try {
		const data = await fetch(url);
		const res = await data.json();
		const duration = Math.round(res.routes[0].duration / 60)
		const geometry = res.routes[0].geometry
		
		return {res, duration, geometry}|| [];
	} catch (error) {
		console.error("Walking directions fetch failed:", error);
		return [];
	}
}

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

export const metersToWalkMinutes = (meters) => (meters * 1.3) / 83

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
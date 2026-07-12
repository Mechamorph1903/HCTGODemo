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



export const buildTransitGraph = (groupedStops, routes) => {
	const adjacencyList = {}

	for(const route in groupedStops){
		const stops = groupedStops[route]
		stops.forEach((stop,index) => {
			const nextStop = stops[index + 1]
			const prevStop = stops[index - 1]
			if (!adjacencyList[stop.name]) {
				adjacencyList[stop.name] = []
			}
			if (prevStop){
				const alreadyConnected = adjacencyList[stop.name].some(edge => edge.to === prevStop.name)
				if (!alreadyConnected) {
					adjacencyList[stop.name].push({
						to: prevStop.name,
						weight: stop.minuteOffset - prevStop.minuteOffset
					})
       			}
			}
			if (nextStop){
				const alreadyConnected = adjacencyList[stop.name].some(edge => edge.to === nextStop.name)
				if (!alreadyConnected) {
					adjacencyList[stop.name].push({
						to: nextStop.name,
						weight: nextStop.minuteOffset - stop.minuteOffset
					})
				}
			}
		})
	}

	//transfer edges

	for(const route in groupedStops){
		stops = groupedStops[route]

		stops.forEach((stop,index) => {
			if(stop.transfer.available === true){
				let connectedRoutes = stop.transfer.connections.split(",")

				for(const line in connectedRoutes){
					
				}


			}
		})
	}
	return adjacencyList
}

export const getPath = (parent,target) => {
    const pathArr = []
    pathArr.push(target)
    let curr = parent[target]
    while(curr){
        pathArr.push(curr)
        curr = parent[curr]
    }

    
    const path = pathArr.reverse().join(" -> ")
	
    return path

}

export const djisktras = (graph,start) => {
    const distances = {}
    const parents = {}
    const visited = new Set()

    for (const node in graph) {
        distances[node] = Infinity
    }
    distances[start] = 0

    while(true){
        let minNode = null

        for(const node in distances){
            if(visited.has(node)) continue
            if(minNode == null || distances[node] < distances[minNode]){
                minNode = node
            }
        }

        if(minNode === null || distances[minNode] === Infinity) break

		if (!graph[minNode]) {
			console.log('Missing node:', minNode)
			visited.add(minNode)
			continue
		}

        for(const neighbour of graph[minNode]){
            const nuDist = neighbour.weight + distances[minNode]

            if(nuDist < distances[neighbour.to]){
				if(graph[neighbour.to] !== undefined){
					parents[neighbour.to] = minNode
					distances[neighbour.to] = nuDist
				}
            }

        }
        visited.add(minNode)
    }

    return {distances, parents}
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

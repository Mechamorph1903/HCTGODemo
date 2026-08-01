import { useEffect, useRef, useState, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { db } from '../data/firebase.js'
import { collection, getDocs } from 'firebase/firestore'
import mapboxgl from 'mapbox-gl'
import { useLiveBuses } from '../hooks/busPositions.js'


export default function Home() {
  const [routes, setRoutes] = useState([])       // Holds our 7 color lines metadata
  const [allStops, setAllStops] = useState([])   // Holds all stops globally for mapping
  const [activeFilter, setActiveFilter] = useState(null)
  //mapbox refs
  const mapContainer = useRef(null) // points at the div
  const map = useRef(null) // stores the mapbox instance
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

 //this gets the created_user from the api and matches it to the appropriate object in the routes array so as to get the right color for bus icons
  const getBusColor = (createdUser) => {
    const route = routes.find(route => createdUser.includes(route.name))
    if(route){
      return route.color
    }
    return "Gray"
  }

  const [favouriteRoutes, setFavouriteRoutes] = useState(["blue", "green"])



  //EFFECT 1: Fetch Routes and Stops from Cloud Firestore on Boot
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

  //EFFECT 2: Live ESRI/ArcGIS Bus Tracker API (runs every 5 seconds)
  const busPositions = useLiveBuses()

  //EFFECT 3: create map object
  useEffect(() => {
  if (map.current) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-89.2903, 31.3271],
      zoom: 12
    })
  }, [])

  //EFFECT 4: creates mapbox object with props and checks if mapbox object is drawn nd if stopdata is ready before adding layers then adds the layers such as stops and lines
  useEffect(() => {
    if (!map.current || !allStops.length || !routes.length) return//  map not initialized or firebase not ready

    const minlat = Math.min(...allStops.map(s => s.coords[0]))
    const minlng = Math.min(...allStops.map(s => s.coords[1]))
    const maxlat = Math.max(...allStops.map(s => s.coords[0]))
    const maxlng = Math.max(...allStops.map(s => s.coords[1]))

    // console.log("Min Lat:", minlat)
    // console.log("Min Lng:", minlng)
    // console.log("Max Lat:", maxlat)
    // console.log("Max Lng:", maxlng)
    const addLayers = () => {
      routes.forEach(route => {
        const routeStops = allStops
          .filter(stop => stop.routeId === route.id)
          .sort((a, b) => a.stopNum - b.stopNum)

        const lineCoords = routeStops.map(stop => [stop.coords[1], stop.coords[0]])
        if (routeStops.length > 1) lineCoords.push(lineCoords[0])
         
        if(!map.current.getSource(`route-${route.id}`)){
          map.current.addSource(`route-${route.id}`, {
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
          id: `route-line-${route.id}`,
          type: 'line',
          source: `route-${route.id}`,
          paint: {
            'line-color': route.color,
            'line-width': 4
          }
        })
        }

        if(!map.current.getSource(`stops-${route.id}`)){
          map.current.addSource(`stops-${route.id}`, {
            type: `geojson`,
            data: {
              type: 'FeatureCollection',
              features: routeStops.map(stop => ({
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
            id: `stops-stop-${route.id}`,
            type: 'circle',
            source: `stops-${route.id}`,
            paint: {
              'circle-radius': 4,
              'circle-color': '#ffffff',
              'circle-stroke-color': route.color,
              'circle-stroke-width': 2
            }

          })
        }
        
    })
    }
    
    if (map.current.isStyleLoaded()) {
      map.current.fitBounds([[minlng, minlat], [maxlng, maxlat]], { padding: 40 })
      addLayers() // style already loaded, run immediately
    } else {
      map.current.on('load', () => {
        map.current.fitBounds([[minlng, minlat], [maxlng, maxlat]], { padding: 40 })
        addLayers()
      } // wait for style
  )}
  }, [allStops, routes])  // runs whenever firebase data arrives

  //EFFECT 5: rendering bus on mapbox object
    useEffect(() => {
      if (!map.current || !busPositions.length || !routes.length) return

      const filteredBuses = activeFilter 
        ? busPositions.filter(bus => bus.attributes.created_user.includes(activeFilter))
        : busPositions

      const busGeoJSON = {
        type: 'FeatureCollection',
        features: filteredBuses.map(bus => ({
          type: 'Feature',
          properties: { color: getBusColor(bus.attributes.created_user) },
          geometry: {
            type: 'Point',
            coordinates: [bus.geometry.x, bus.geometry.y]
          }
        }))
      }

      if (!map.current.isStyleLoaded()) return

      if (!map.current.getSource('bus-positions')) {
        map.current.addSource('bus-positions', { type: 'geojson', data: busGeoJSON })
        map.current.addLayer({
          id: 'bus-layer',
          type: 'circle',
          source: 'bus-positions',
          paint: {
            'circle-radius': 8,
            'circle-color': ['get', 'color'],
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2
          }
        })
      } else {
        map.current.getSource('bus-positions').setData(busGeoJSON)
      }

    }, [busPositions, activeFilter])


  // EFFECT 6: ROute Filtering on MAP
  useEffect(() => {
    if (!map.current || !routes.length) return
    if (!map.current.getLayer(`route-line-${routes[0].id}`)) return


    if(activeFilter === null){
      routes.forEach(route => {
        map.current.setLayoutProperty(`stops-stop-${route.id}`, 'visibility', 'visible')
        map.current.setLayoutProperty(`route-line-${route.id}`, 'visibility', 'visible')
      })
    } else {
      routes.forEach(route => {
        if(route.name === activeFilter){
          map.current.setLayoutProperty(`stops-stop-${route.id}`, 'visibility', 'visible')
          map.current.setLayoutProperty(`route-line-${route.id}`, 'visibility', 'visible')
        } else{
          map.current.setLayoutProperty(`stops-stop-${route.id}`, 'visibility', 'none')
          map.current.setLayoutProperty(`route-line-${route.id}`, 'visibility', 'none')
        }
      })
    }
  },[activeFilter])
 


  return (
    <div className="flex flex-col items-center justify-center h-full text-black text-xl font-sans antialiased mx-auto shadow-xl">
      {/**HEADER SECTION  */}
      <div className='flex justify-between items-center w-full px-6 py-4 bg-white border-b border-slate-100'>
        <NavLink to="/Info" className="text-slate-500 hover:text-slate-800 transition-colors">
          <FontAwesomeIcon icon="fa-solid fa-circle-info" className="text-xl" />
        </NavLink>
        <span className="font-bold text-lg tracking-tight text-slate-800">HCTGo</span>
        <NavLink to="/Alerts" className="text-slate-500 hover:text-slate-800 transition-colors relative">
          <FontAwesomeIcon icon="fa-solid fa-bell" className="text-xl" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-blue-500"></span>
        </NavLink>
      </div>



      


      {/*TOP MAP FILTERS: Route Sort Selector Row */}
      <div className="flex items-center gap-2 overflow-x-auto w-100 px-5 py-2.5 bg-white border-b border-slate-100 shrink-0 scrollbar-none">
        <button
          onClick={() => setActiveFilter(null)}
          className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all whitespace-nowrap active:scale-95 ${
            activeFilter === null 
              ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Routes
        </button>
        {routes.map(route => (
          // make this that when yu click on an active filter it reverts to all routes
          <button
            key={route.name}
            onClick={() => setActiveFilter(route.name)}
            className={`px-3 py-1.5 text-xs font-bold rounded-full border flex items-center gap-1.5 transition-all whitespace-nowrap active:scale-95 ${
              activeFilter === route.name 
                ? 'border-transparent text-white shadow-sm' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            style={activeFilter === route.name ? { backgroundColor: route.color } : {}}
          >
            <span className="w-2 h-2 rounded-full" style={activeFilter === route.name ? { backgroundColor: '#fff' } : { backgroundColor: route.color }} />
            {route.name}
          </button>
        ))}
      </div>





      {/*GENERAL MAP */}
      <div id="Map" ref={mapContainer} className='h-128 w-110 overflow-hidden rounded-xl' />
          
            

      {/*FAVOURITE ROUTES SECTION*/}
      <div>
        <h1>Favourite Routes</h1>

        {
          favouriteRoutes.map((route, index) => {
            
          })
        }
      </div>
    </div>
  )
}
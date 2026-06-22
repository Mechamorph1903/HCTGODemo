import { MapContainer, TileLayer, useMap, Marker, Popup, CircleMarker,Polyline } from 'react-leaflet'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { db } from '../data/firebase.js'
import { collection, getDocs } from 'firebase/firestore'


export default function Home() {
  const [routes, setRoutes] = useState([])       // Holds our 7 color lines metadata
  const [allStops, setAllStops] = useState([])   // Holds all stops globally for mapping
  const [loading, setLoading] = useState(true)
    

  //This is where we will store and constantly update live bus positions
  const [busPositions, setBusPositions] = useState([])
  const [activeFilter, setActiveFilter] = useState(null) // null = Show All, or 'Blue', 'Red', etc.
  const [favouriteRoutes, setFavouriteRoutes] = useState(["blue", "green"])


  // 📡 EFFECT 1: Fetch Routes and Stops from Cloud Firestore on Boot
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

        setLoading(false);
      } catch (error) {
        console.error("Error connecting to Transit Cloud Firestore: ", error);
        setLoading(false);
      }
    }

    downloadCloudTransitData();
  }, []);

  // 🚌 EFFECT 2: Live ESRI/ArcGIS Bus Tracker API (runs every 5 seconds)
  useEffect(() => {

    const fetchBusLive = async () => {
      const response = await fetch("https://utility.arcgis.com/usrsvcs/servers/b02066689d504f5f9428029f7268e060/rest/services/Hosted/8bd5047cc5bf4195887cc5237cf0d3e0_Track_View/FeatureServer/1/query?f=json&where=1=1&outFields=*").then( res => res.json()).then( data => setBusPositions(data.features)).catch(err => console.log(err))
    }


    fetchBusLive()

    const timer = setInterval(fetchBusLive, 5000)

    return () => {
      //removes refresh timer when component unmounts so as to prevent it calling when it doesnt exist and causing an error
      clearInterval(timer)
    }
  }, [])

  //this gets the created_user from the api and matches it to the appropriate object in the routes array so as to get the right color for bus icons
  const getBusColor = (createdUser) => {
    const route = routes.find(route => createdUser.includes(route.name))
    if(route){
      return route.color
    }
    return "Gray"
}
  const visibleRoutes = activeFilter 
    ? routes.filter(r => r.name === activeFilter) 
    : routes
  const getGroupedStops = () => {
    const groups = {};

    // Filter out stops belonging to currently visible routes
    const allowedRouteIds = visibleRoutes.map(r => r.id);
    const visibleStops = allStops.filter(stop => allowedRouteIds.includes(stop.routeId));

    visibleStops.forEach(stop => {
      // Create a unique coordinate key identifier string (e.g., "31.32,-89.29")
      const coordKey = `${stop.coords[0].toFixed(5)},${stop.coords[1].toFixed(5)}`;
      
      if (!groups[coordKey]) {
        groups[coordKey] = {
          coords: stop.coords,
          names: new Set([stop.name]),
          servingRoutes: new Set([stop.routeId]), // Tracks which routes pass through here
          stopNumbers: []
        };
      } else {
        groups[coordKey].names.add(stop.name);
        groups[coordKey].servingRoutes.add(stop.routeId);
      }
      groups[coordKey].stopNumbers.push(`${stop.routeId.toUpperCase()} #${stop.stopNum}`);
    });

    return Object.values(groups);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-600 font-semibold">
        <div className="text-center">
          <p className="text-xl animate-pulse">🛰️ Syncing with HubCity Transit Cloud...</p>
        </div>
      </div>
    );
  }

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



      {/**SEARCH BAR SECTION */}
      <div className='px-5 pt-4 pb-2 bg-white '>
        {/* //planing to implement a way to a system, similar to transit, where you can begin your journey in app and search for destination while it calculates best way to use transit there */}
        <h1 className='text-2xl font-semibold font-black tracking-tight text-slate-900 mb-3'>Where to next?</h1>
        <div className='relative flex items-center mb-2'>
          <div className="absolute left-4 text-slate-400">
            <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" className="text-sm" />
          </div>
          <input 
            type="text" 
            name="search-bar" 
            className='w-full pl-11 pr-24 py-3 bg-slate-100 text-slate-900 placeholder-slate-400 font-medium text-base rounded-2xl border border-transparent focus:outline-none focus:bg-white focus:border-blue-500/50 transition-all shadow-inner' 
            placeholder='Search destinations, lines...'
          />
          <button 
            type="button" 
            className='absolute right-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm rounded-xl transition-all shadow-sm'
          >
            Go
          </button>
        </div>
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
      <div id="Map" className='h-128 w-full p-5 overflow-hidden relative'>
          <MapContainer 
            center={[ 31.3271, -89.2903]} 
            zoom={11.9} 
            minZoom={11}
            maxZoom={17}
            maxBounds={[[31.252, -89.4198], [31.3724, -89.1663]]}
            maxBoundsViscosity={1.0} 
            scrollWheelZoom={false} 
            className='h-full w-full z-10 rounded-xl'>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* //what we have done here is populated the leaflet map object with route points from stops.js and connecting them
              //with colored lines representing the routes they belong on. lines arent perfect yet but will get there
              // my plan for transfer points is for the point to have all colours of routes on transfers */}
              {/* Loop ONLY through filtering conditions */}
              {visibleRoutes.map((route, index) =>{ 
                const routeStops = allStops
                  .filter(stop => stop.routeId === route.id)
                  .sort((a, b) => a.stopNum - b.stopNum);
                
                
                return (
                <span key={index}>
                  {/* 
                      SOrt by stop num to get accurate lines manually go to the stop.js and do this also have to add missing stops
                      and to close the stop lines repeat the first stop twice but different stopnums as 1 and nth(last)
                  */}
                  {routeStops.length > 0 && (
                      <Polyline 
                        positions={routeStops.map(stop => stop.coords)}
                        color={route.color}
                        weight={5}
                        opacity={activeFilter ? 0.95 : 0.65}
                      />
                    )}
                  
                 {/* LAYER 2: Draw the interactive combined points on top */}
                  {getGroupedStops().map((groupedStop, idx) => {
                    const routeIdsArray = Array.from(groupedStop.servingRoutes);
                    // If a stop serves multiple routes, color the circle dark slate, otherwise use the line color
                    const markerColor = routeIdsArray.length > 1 ? '#1e293b' : routes.find(r => r.id === routeIdsArray[0])?.color || '#334155';

                    return (
                      <CircleMarker 
                        key={`group_stop_${idx}`}
                        center={groupedStop.coords}
                        radius={4} 
                        fillColor="white"
                        color={markerColor}
                        fillOpacity={1}
                        weight={2.5}
                      >
                        <Popup>
                          <div className="text-sm font-sans min-w-[160px]">
                            {/* Combines slash names if they differ across routes */}
                            <h4 className="font-bold text-slate-900 leading-tight mb-1">
                              {Array.from(groupedStop.names).join(' / ')}
                            </h4>
                            
                            <div className="border-t border-slate-100 pt-1.5 mt-1.5">
                              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Serves Lines:</p>
                              <div className="flex flex-wrap gap-1">
                                {routeIdsArray.map(rId => {
                                  const rData = routes.find(r => r.id === rId);
                                  return (
                                    <span 
                                      key={rId} 
                                      className="px-1.5 py-0.5 text-[10px] font-extrabold text-white rounded uppercase"
                                      style={{ backgroundColor: rData?.color || '#94a3b8' }}
                                    >
                                      {rData?.name || rId}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-500 mt-2 font-medium bg-slate-50 p-1 rounded border border-slate-100">
                              📌 {groupedStop.stopNumbers.join(', ')}
                            </p>
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}

                  {/* Filter live buses map indicators matching active view bounds */}
                  {busPositions
                    .filter(bus => bus.attributes.created_user.includes(route.name))
                    .map(bus => (
                      <CircleMarker
                        key={bus.attributes.objectid}
                        center={[bus.geometry.y, bus.geometry.x]}
                        radius={8}
                        fillColor={route.color}
                        color='white'
                        fillOpacity={1}
                        weight={2.5}
                        className="animate-pulse"
                      />
                    ))
                  }
                </span>
              )})}
          </MapContainer>
      </div>
      


            

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
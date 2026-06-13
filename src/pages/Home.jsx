import { MapContainer, TileLayer, useMap, Marker, Popup, CircleMarker,Polyline } from 'react-leaflet'
import {greenStops, goldStops, orangeStops, blueStops, redStops, purpleStops, brownStops} from '../data/stops.js'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'


export default function Home() {
  //an array of objects contaning route data and their colors
    const routes = [
    { stops: greenStops, color: '#38A800', name: 'Green'}, //Green Route is ordered and complete
    { stops: blueStops, color: '#0070FF' , name: 'Blue'},
    { stops: brownStops, color: '#732600' , name: 'Brown'},
    { stops: goldStops, color: '#E6E600' , name: 'Gold'},
    { stops: purpleStops, color: '#A900E6' , name: 'Purple'},
    { stops: orangeStops, color: '#FC921F' , name: 'Orange'},
    { stops: redStops, color: '#E60000' , name: 'Red'},
    
  ]

  //This is where we will store and constantly update live bus positions
  const [busPositions, setBusPositions] = useState([])
  console.log(busPositions)

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

  return (
    <div className="flex flex-col items-center justify-center h-full text-black  text-xl">
      <div className='flex justify-between w-full p-6'>
        <NavLink to="/Info"><FontAwesomeIcon icon="fa-solid fa-circle-info" /></NavLink>
        <NavLink to="/Alerts"><FontAwesomeIcon icon="fa-solid fa-bell" /></NavLink>
      </div>
      <h1>Howdy</h1>
      <div className='flex '>
        {/* //planing to implement a way to a system, similar to transit, where you can begin your journey in app and search for destination while it calculates best way to use transit there */}
        <input type="text" name="search-bar" className='border-2 rounded-xl' placeholder='Where to?'/>
        <button type="button" className='bg-blue-200'>Search</button>
      </div>
      <div id="Map" className='h-128 w-full p-5'>
          <MapContainer 
            center={[ 31.3271, -89.2903]} 
            zoom={11.9} 
            minZoom={11}
            maxZoom={17}
            maxBounds={[[31.252, -89.4198], [31.3724, -89.1663]]}
            maxBoundsViscosity={1.0} 
            scrollWheelZoom={false} 
            className='h-full w-full'>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* //what we have done here is populated the leaflet map object with route points from stops.js and connecting them
            //with colored lines representing the routes they belong on. lines arent perfect yet but will get there
            // my plan for transfer points is for the point to have all colours of routes on transfers */}
            {routes.map(route => (
              <>
                {/* 
                    SOrt by stop num to get accurate lines manually go to the stop.js and do this also have to add missing stops
                    and to close the stop lines repeat the first stop twice but different stopnums as 1 and nth(last)
                */}
                <Polyline 
                  positions={route.stops.sort((a, b) => a.stopNum - b.stopNum).map(stop => stop.coords)}
                  color={route["color"]}
                />
                {route["stops"].map(stop => (
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
                  {
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
                  }
                  
              </>

              
            ))}
          </MapContainer>
      </div>
    </div>
  )
}
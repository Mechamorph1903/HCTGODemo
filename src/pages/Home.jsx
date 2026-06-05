import { MapContainer, TileLayer, useMap, Marker, Popup, CircleMarker,Polyline } from 'react-leaflet'
import {greenStops, goldStops, orangeStops, blueStops, redStops, purpleStops, brownStops} from '../data/stops.js'
import { useEffect, useState } from 'react'


export default function Home() {
  //an array of objects contaning route data and their colors
    const routes = [
    { stops: greenStops, color: '#38A800' }, //Green Route is ordered and complete
    { stops: blueStops, color: '#0070FF' },
    { stops: brownStops, color: '#732600' },
    { stops: goldStops, color: '#E6E600' },
    { stops: purpleStops, color: '#A900E6' },
    { stops: orangeStops, color: '#FC921F' },
    { stops: redStops, color: '#E60000' },
    
  ]

  const [busPositions, setBusPositions] = useState([])


  return (
    <div className="flex flex-col items-center justify-center h-full text-black  text-xl">
      <h1>Howdy</h1>
      <div className='flex '>
        {/* //planing to implement a way to a system, similar to transit, where you can begin your journey in app and search for destination while it calculates best way to use transit there */}
        <input type="text" name="search-bar" className='border-2 rounded-xl' placeholder='Where to?'/>
        <button type="button" className='bg-blue-200'>Search</button>
      </div>
      <div id="Map" className='h-128 w-full p-5'>
          <MapContainer center={[ 31.3271, -89.2903]} zoom={11.6} scrollWheelZoom={false} className='h-full w-full'>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* //what we have done here is populated the leaflet map object with route points from stops.js and connecting them
            //with colored lines representing the routes they belong on. lines arent perfect yet but will get there
            // my plan for transfer points is for the point to have all colours of routes on transfers */}
            {routes.map(route => (
              <>
                {route["stops"].map(stop => (
                    <CircleMarker 
                      key={stop.id}
                      center={stop.coords}
                      radius={2}
                      fillColor={route["color"]}
                      color='grey'
                      fillOpacity={4}
                      weight={1}
                    />
                  ))}
                  {/* 
                    SOrt by stop num to get accurate lines manually go to the stop.js and do this also have to add missing stops
                    and to close the stop lines repeat the first stop twice but different stopnums as 1 and nth(last)
                  */}
                  <Polyline 
                    positions={route.stops.sort((a, b) => a.stopNum - b.stopNum).map(stop => stop.coords)}
                    color={route["color"]}
                  />
              </>

              
            ))}
          </MapContainer>
      </div>
    </div>
  )
}
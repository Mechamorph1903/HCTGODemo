import {greenStops, goldStops, orangeStops, blueStops, redStops, purpleStops, brownStops} from '../data/stops.js'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { MapContainer, Polyline, CircleMarker } from "react-leaflet"


export default function RoutePage({route}){
    const routes = [
          { stops: greenStops, color: '#38A800', name: 'Green', alt: "(4th Street)", passThru: ["USM", "Midtown", "Walmart @ 49"]}, //Green Route is ordered and complete
          { stops: blueStops, color: '#0070FF' , name: 'Blue', alt: "(Hardy Street)", passThru: ["Midtown", "Turtle Creek"]},
          { stops: brownStops, color: '#732600' , name: 'Brown', alt: "(7th Street)", passThru: ["Highway 42", "Downtown"]},
          { stops: goldStops, color: '#E6E600' , name: 'Gold', alt: "(USM)", passThru: ["Southern Miss"]}, //Ordered and Complete
          { stops: purpleStops, color: '#A900E6' , name: 'Purple', alt: "(Palmer's Crossing)", passThru: ["Edwards Street", "Downtown"]},
          { stops: orangeStops, color: '#FC921F' , name: 'Orange', alt: "(Broadway)", passThru: ["William Carey", "James St", "Downtown"]},
          { stops: redStops, color: '#E60000' , name: 'Red', alt: "(Country Club)", passThru: ["Cloverleaf", "William Carey", "Walmart @ 49"]}, //Ordered and Complete
          
        ]
    
        const regRoute = route.toLowerCase()
    return(
        <div className='text-black p-6'>
            <div className='flex justify-between h-15'>
                <NavLink to="/Lines"><FontAwesomeIcon icon="fa-solid fa-angle-left"  className='text-3xl'/></NavLink>
                <div className={`text-3xl bg-${regRoute}-300 rounded-xl h-3 w-3`}></div>
            </div>
            <div className='grid '>
                <div>
                    <h1>{route} Route</h1>
                </div>
            </div>
        </div>
    )
}
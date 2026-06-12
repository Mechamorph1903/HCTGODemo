import RoutePill from "../components/BusPill"
import {greenStops, goldStops, orangeStops, blueStops, redStops, purpleStops, brownStops} from '../data/stops.js'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

export default function Lines() {
  const routes = [
      { stops: greenStops, color: '#38A800', name: 'Green', alt: "(4th Street)", passThru: ["USM", "Midtown", "Walmart @ 49"]}, //Green Route is ordered and complete
      { stops: blueStops, color: '#0070FF' , name: 'Blue', alt: "(Hardy Street)", passThru: ["Midtown", "Turtle Creek"]},
      { stops: brownStops, color: '#732600' , name: 'Brown', alt: "(7th Street)", passThru: ["Highway 42", "Downtown"]},
      { stops: goldStops, color: '#E6E600' , name: 'Gold', alt: "(USM)", passThru: ["Southern Miss"]},
      { stops: purpleStops, color: '#A900E6' , name: 'Purple', alt: "(Palmer's Crossing)", passThru: ["Edwards Street", "Downtown"]},
      { stops: orangeStops, color: '#FC921F' , name: 'Orange', alt: "(Broadway)", passThru: ["William Carey", "James St", "Downtown"]},
      { stops: redStops, color: '#E60000' , name: 'Red', alt: "(Country Club)", passThru: ["Cloverleaf", "William Carey", "Walmart @ 49"]},
      
    ]

  return (
    <div className="grid grid-columns-3 grid-rows-9 h-full text-black text-xl p-6">
      {/* //finna grid this */}
      <h1 className="col-span-2">Bus Routes</h1>
      <div className="justify-self-end">
        <FontAwesomeIcon icon="fa-solid fa-route" />
      </div>      
      {/* //where we will map all the routepills */}
      <div className="col-span-3 row-span-8 flex flex-col gap-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-y">
        {
          routes.map((route,index) => (
            <NavLink
              key={index}
              to={`/${route.name}`}
              className="snap-center"
            >
              <RoutePill name={route.name} color={route.color} alt={route.alt} passthrough={route.passThru}/>
            </NavLink>
          ))
        }
      </div>
    </div>
  )
}
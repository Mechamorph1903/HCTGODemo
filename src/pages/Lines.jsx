import RoutePill from "../components/BusPill"
import { Red, Green, Gold, Brown, Blue, Purple, Orange } from '../data/routes.js'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

export default function Lines() {
  const routes = [Red, Green, Gold, Blue, Purple, Orange, Brown]


  return (
    <div className="grid grid-columns-3 grid-rows-9 h-full text-black text-xl p-5 py-2">
      {/* //finna grid this */}
      <h1 className="col-span-2">Bus Routes</h1>
      <div className="justify-self-end">
        <FontAwesomeIcon icon="fa-solid fa-route" />
      </div>      
      {/* //where we will map all the routepills */}
      <div className="col-span-3 row-span-8 flex flex-col gap-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-y">
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
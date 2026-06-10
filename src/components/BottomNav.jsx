import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fas, far, fab)

//This is an array of objects that stores the routes, labvels and icons of each of the icons on the bottomNav
const tabs = [
  { to: '/',        label: 'Home',     icon: "f-solid fa-house" },
  { to: '/Lines',   label: 'Routes',   icon: "fa-solid fa-bus-side" },
  { to: '/Explore',  label: 'Explore',   icon: "fa-regular fa-compass" },
  { to: '/Settings',label: 'Settings', icon: "fa-solid fa-user-gear"},
]

export default function BottomNav() {
  return (
    <nav className="flex justify-around items-center h-16 bg-zinc-200 border-t border-zinc-700">
      {/* Map to apply formatting to alll items in the array, makes a navlink for each icon */}
      {tabs.map(tab => (
        <NavLink
        // to: is where we navigate to think of it as the href for the a tag
        // key: 
          key={tab.to}
          to={tab.to}
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs transition-colors ${
              isActive ? 'text-blue-400' : 'text-zinc-500'
            }`
          }
        >
          <span className="text-xl"><FontAwesomeIcon icon={tab.icon} /></span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
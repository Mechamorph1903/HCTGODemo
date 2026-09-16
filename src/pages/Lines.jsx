import RoutePill from "../components/RoutePill.jsx"
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTransitData } from '../context/TransitDataContext.jsx'

export default function Lines() {
  const { routes, loading } = useTransitData()

  if (loading) return <div className="flex items-center justify-center p-10"><div className="loading-spinner" /></div>;

  //deactivated routes shouldn't be offered to riders at all — the home map already
  //filters this way, this list previously didn't
  const visible = routes.filter(r => r.isActive !== false)
  const activeSpecials = visible.filter(r => r.isSpecial)
  const regularRoutes = visible.filter(r => !r.isSpecial)

  const renderRoute = (route) => (
    <NavLink key={route.id} to={`/${route.name}`} className="snap-center">
      <RoutePill
        name={route.name}
        color={route.color}
        alt={route.alt}
        passthrough={route.passThru}
        routeStatus={route.routeStatus}
        isSpecial={route.isSpecial}
      />
    </NavLink>
  )

  return (
    <div className="grid grid-columns-3 grid-rows-9 h-full text-black dark:text-white text-xl p-5 py-2">
      {/* //finna grid this */}
      <h1 className="col-span-2">Bus Routes</h1>
      <div className="justify-self-end">
        <FontAwesomeIcon icon="fa-solid fa-route" />
      </div>      
      {/* one RoutePill per route, wrapped in a NavLink so tapping it opens that route's page */}
      <div className="col-span-3 row-span-8 flex flex-col gap-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-y">
        {/* only split into labelled sections when a special route is actually running —
            otherwise a lone "Regular Routes" heading is just noise */}
        {activeSpecials.length > 0 ? (
          <>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Special Routes</p>
            {activeSpecials.map(renderRoute)}
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-4">Regular Routes</p>
            {regularRoutes.map(renderRoute)}
          </>
        ) : (
          regularRoutes.map(renderRoute)
        )}
      </div>
    </div>
  )
}
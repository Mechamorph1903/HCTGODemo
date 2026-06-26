import RoutePill from "../components/RoutePill.jsx"
import { useState, useEffect } from "react"
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { db } from '../data/firebase.js'
import { collection, getDocs } from 'firebase/firestore'

export default function Lines() {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const querySnapshot = await getDocs(collection(db, "routes"));
        const cloudRoutes = [];
        querySnapshot.forEach((doc) => {
          cloudRoutes.push({ id: doc.id, ...doc.data() });
        });
        setRoutes(cloudRoutes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching lines registry: ", error);
        setLoading(false);
      }
    }
    fetchRoutes();
  }, []);

  if (loading) return <div className="p-5 text-slate-500">⏳ Loading active lines...</div>;

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
              <RoutePill name={route.name} color={route.color} alt={route.alt} passthrough={route.passThru} routeStatus={route.routeStatus}/>
            </NavLink>
          ))
        }
      </div>
    </div>
  )
}
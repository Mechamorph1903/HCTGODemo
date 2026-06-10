import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useEffect } from 'react'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Lines from './pages/Lines'
import NotificationsPage from './pages/NotificationsPage'
import SettingsPage from './pages/SettingsPage'
import ExplorePage from './pages/VisitHBG'
import RoutePage from './pages/RoutePage'



const slideOrder = ['/', '/Lines', '/Explore', "/Settings"]

export default function App() {
  const location = useLocation()
  const prevlocation = useRef(location.pathname)

  return (
    <div className="mx-auto h-screen max-w-lg bg-white text-black flex flex-col">
      <main className='flex-1 border-2 border-black overflow-y-auto overflow-x-hidden scroll-smooth overscroll-contain scrollbar-thin relative'>
        <AnimatePresence mode='wait'>
          <motion.div
            className='w-full h-full absolute'
            key={location.pathname}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Routes location={location}>
              <Route path='/' element={<Home />} />
              <Route path='/Lines' element={<Lines />} />
              <Route path='/Alerts' element={<NotificationsPage />} />
              <Route path='/Explore' element={<ExplorePage />} />
              <Route path='/Settings' element={<SettingsPage />} />
              <Route path='/Green' element={<RoutePage route="Green"/>} />
              <Route path='/Purple' element={<RoutePage route="Purple"/>} />
              <Route path='/Gold' element={<RoutePage route="Gold"/>} />
              <Route path='/Blue' element={<RoutePage route="Blue"/>} />
              <Route path='/Red' element={<RoutePage route="Red"/>} />
              <Route path='/Orange' element={<RoutePage route="Orange"/>} />
              <Route path='/Brown' element={<RoutePage route="Brown"/>} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  )
}
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
import InfoPage from './pages/Information'



export default function App() {
  const location = useLocation()
  const prevlocation = useRef(location.pathname)

  // this updates prev location anytime location changes(we click to another navbutton)
  useEffect(() => {
    prevlocation.current = location.pathname
  },[location.pathname])

  const slideOrder = ['/', '/Lines','/Green', '/Purple', '/Gold', '/Blue', '/Red', '/Orange', '/Brown', '/Explore', "/Settings"]
  const isInfo = ['/Info', '/Alerts'].includes(location.pathname);
  //this is to figure out if we are sliding left or right dependent on the order of troutes in SlideOrder
  const getDirection = () => {
    const currentIndex = slideOrder.indexOf(location.pathname)
    const prevIndex = slideOrder.indexOf(prevlocation.current)

    //if either page is not in the bottom nav, the indexes will get a -1 and so we will need to exit this function and use another animation
    if (currentIndex === -1 || prevIndex === -1) return 'none';

    return currentIndex > prevIndex ? 1 : -1;
  }

  const direction = getDirection()

  const slideVariants = {
      initial: (dir) => ({
        x: dir === 1 ? 50 : -50, // Enter from right if moving right, left if moving left
        opacity: 0
      }),
      animate: { x: 0, opacity: 1 },
      exit: (dir) => ({
        x: dir === 1 ? -50 : 50, // Exit opposite direction
        opacity: 0
      })
    };

  const scrollVariants = {
    initial: { 
      scaleY: 0, // Starts at 0 height
      opacity: 0, 
      originY: 0 // Forces it to unroll from the top down
    },
    animate: { scaleY: 1, opacity: 1 },
    exit: { scaleY: 0, opacity: 0 }
  };

  const activeVariant = isInfo ? scrollVariants : slideVariants;

  return (
    <div className="mx-auto h-screen max-w-lg bg-white text-black flex flex-col">
      <main className='flex-1 border-x-2 border-black overflow-y-auto overflow-x-hidden scroll-smooth overscroll-contain[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative '>
        <AnimatePresence mode='wait' custom={direction}>
          <motion.div
            className='w-full h-full absolute origin-top'
            custom={direction} //this is what is passed into the variants to use for the dir variables to determine slide direction
            key={location.pathname}
            variants={activeVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <Routes location={location}>
              <Route path='/' element={<Home />} />
              <Route path='/Lines' element={<Lines />} />
              <Route path='/Info' element={<InfoPage />} />
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
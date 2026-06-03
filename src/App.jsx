import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Lines from './pages/Lines'
import NotificationsPage from './pages/NotificationsPage'
import SettingsPage from './pages/SettingsPage'


export default function App() {

  return (
    <div className="mx-auto h-screen max-w-lg bg-white text-white flex flex-col">
      <main className='flex-1 border-2 border-black'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/lines' element={<Lines />} />
          <Route path='/alerts' element={<NotificationsPage />} />
          <Route path='/settings' element={<SettingsPage />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
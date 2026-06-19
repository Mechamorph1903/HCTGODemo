import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Red, Green, Gold, Brown, Blue, Purple, Orange } from '../data/routes.js'

const routes = [Red, Green, Gold, Blue, Purple, Orange, Brown]


export default function SettingsPage() {
  const [favRoutes, setFavRoutes] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const toggleFav = (name) => {
    setFavRoutes(prev =>
      prev.includes(name) ? prev.filter(r => r !== name) : [...prev, name]
    )
  }

  return (
    <div className="flex flex-col h-full text-black overflow-y-auto [&::-webkit-scrollbar]:hidden">
      
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-6 border-b border-slate-100">
        <div className="h-14 w-14 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-500">
          R
        </div>
        <div>
          <p className="font-semibold text-lg leading-tight">Rider</p>
          <p className="text-slate-400 text-sm">rider@email.com</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="flex flex-col gap-6 p-6">

        {/* Favourite Routes */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Favourite Routes</p>
          <div className="flex flex-col gap-2">
            {routes.map(route => (
              <div
                key={route.name}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: route.color }}
                  />
                  <span className="font-medium text-sm">{route.name} Route</span>
                  <span className="text-slate-400 text-xs">{route.alt}</span>
                </div>
                <button onClick={() => toggleFav(route.name)}>
                  <FontAwesomeIcon
                    icon={favRoutes.includes(route.name) ? 'fa-solid fa-star' : 'fa-regular fa-star'}
                    className={favRoutes.includes(route.name) ? 'text-yellow-400' : 'text-slate-300'}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Preferences</p>
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon="fa-solid fa-moon" className="text-slate-400" />
              <span className="text-sm font-medium">Dark Mode</span>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 ${darkMode ? 'bg-blue-500' : 'bg-slate-200'}`}
            >
              <div className={`h-5 w-5 bg-white rounded-full shadow transition-transform duration-200 mx-0.5 ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Account</p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full p-4 rounded-xl border border-red-100 bg-red-50 text-red-500 text-sm font-medium text-left flex items-center gap-3"
            >
              <FontAwesomeIcon icon="fa-solid fa-trash" />
              Delete Account
            </button>
          ) : (
            <div className="p-4 rounded-xl border border-red-200 bg-red-50">
              <p className="text-sm text-red-600 font-medium mb-3">Are you sure? This can't be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium"
                >
                  Cancel
                </button>
                <button className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
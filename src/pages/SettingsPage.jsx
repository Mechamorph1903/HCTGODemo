import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { db } from '../data/firebase.js'
import { collection, getDocs } from 'firebase/firestore'
import { useAuthContext } from '../context/AuthContext.jsx'
import { useThemeContext } from '../context/ThemeContext.jsx'

export default function SettingsPage() {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const { preference, setTheme } = useThemeContext()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const {profile, toggleFavorite } = useAuthContext()

  //EFFECT: pull the route list from firestore so we have something to list as favourite-able
  useEffect(() => {
    async function loadRoutes() {
      try {
        const querySnapshot = await getDocs(collection(db, "routes"));
        const cloudRoutes = [];
        querySnapshot.forEach((doc) => {
          cloudRoutes.push({ id: doc.id, ...doc.data() });
        });
        setRoutes(cloudRoutes);
        setLoading(false);
      } catch (error) {
        console.error("Error setting up options pane array structures: ", error);
        setLoading(false);
      }
    }
    loadRoutes();
  }, []);

 

  if (loading) return <div className="p-6 text-slate-500">⏳ Reading profile settings...</div>;

  return (
    <div className="flex flex-col h-full text-black overflow-y-auto [&::-webkit-scrollbar]:hidden dark:text-white dark:bg-slate-900">
      
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="h-14 w-14 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-500 dark:bg-slate-700">
          {profile.firstName[0]}{profile.lastName[0]}
        </div>
        <div>
          <p className="font-semibold text-lg leading-tight">{profile.firstName} {profile.lastName}</p>
          <p className=" text-sm text-slate-400  dark:text-slate-500 leading-tight">@{profile.userName}</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="flex flex-col gap-6 p-6">

        {/* Favourite Routes */}
        <div>
          <p className="text-xs font-semibold text-slate-400  dark:text-slate-500 uppercase tracking-widest mb-3">Favourite Routes</p>
          <div className="flex flex-col gap-2">
            {routes.map(route => (
              <div
                key={route.name}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: route.color }}
                  />
                  <span className="font-medium text-sm">{route.name} Route</span>
                  <span className="text-slate-400 dark:text-slate-400 text-xs">{route.alt}</span>
                </div>
               <button onClick={() => toggleFavorite(route.id)}>
                  <FontAwesomeIcon
                      icon={profile.favoriteRoutes.includes(route.id) ? 'fa-solid fa-star' : 'fa-regular fa-star'}
                      className={profile.favoriteRoutes.includes(route.id) ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}
                  />
              </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Preferences</p>
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
            <div className="flex gap-1 bg-slate-200 dark:bg-slate-700 rounded-full p-1">
                {['system', 'light', 'dark'].map(option => (
                    <button
                        key={option}
                        onClick={() => setTheme(option)}
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                            preference === option ? 'bg-white dark:bg-slate-900 shadow-sm' : 'text-slate-500'
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* Danger Zone - delete button doesn't actually delete anything yet, just shows the confirm step */}
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
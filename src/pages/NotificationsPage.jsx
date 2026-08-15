import { useEffect, useState } from "react"
import AlertPill from "../components/AlertPill"
import { db } from "../data/firebase.js"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"

export default function NotificationsPage() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  //EFFECT: live-subscribe to the alerts collection (newest first) so new alerts show up without a refresh
  useEffect(() => {
    const alertsQuery = query(collection(db, "alerts"), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(alertsQuery, (snapshot) => {
      const cloudAlerts = []
      snapshot.forEach((doc) => {
        cloudAlerts.push({ id: doc.id, ...doc.data() })
      })
      setAlerts(cloudAlerts)
      setLoading(false)
    }, (error) => {
      console.error("Error listening to alerts: ", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) return <div className="p-6 text-slate-500 dark:text-slate-400">⏳ Checking for alerts...</div>;

  return (
    <div className="flex flex-col items-center justify-center h-full text-black dark:text-white text-xl gap-4">
      <h1 className="text-2xl font-bold">Alerts</h1>
      <div className="p-4 flex flex-col gap-3">
        {alerts.length > 0 ? alerts.map((alert) => (
          <AlertPill
            key={alert.id}
            subject={alert.subject}
            message={alert.message}
            priority={alert.priority}
            buses={alert.buses}
          />
        )) : (
          <p className="text-sm text-slate-400 dark:text-slate-500">No new alerts right now.</p>
        )}
      </div>
    </div>

  )
}
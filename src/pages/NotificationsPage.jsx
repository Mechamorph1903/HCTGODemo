import { useState } from "react"
import AlertPill from "../components/AlertPill"

const initialAlerts = [
  {
    subject: "Summer in the Hub City! ☀️",
    message: "Three months of summer heat means endless things to do in Hattiesburg! Catch a ride with HCT to explore the city and beat the heat.",
    priority: "medium",
    buses: ["Blue", "Green", "Gold", "Purple", "Red", "Orange", "Brown"]
  },
  {
    subject: "Route Delay: Gold Line 🚧",
    message: "Due to unexpected construction on Hardy St, the Gold Line is experiencing 10-15 minute delays. Thank you for your patience!",
    priority: "high",
    buses: ["Gold"]
  },
  {
    subject: "4th of July Holiday Schedule 🎆",
    message: "Reminder: HCT will run on a modified holiday schedule this Thursday. Check the updated transit timetables in the app before you head out.",
    priority: "medium",
    buses: ["Blue", "Green", "Gold", "Purple", "Red", "Orange", "Brown"]
  },
  {
    subject: "Inclement Weather Warning ⛈️",
    message: "Heavy rain and local flooding may cause minor delays across all routes this afternoon. Please plan ahead and stay safe!",
    priority: "high",
    buses: ["Blue", "Green", "Gold", "Purple", "Red", "Orange", "Brown"]
  },
  {
    subject: "Commuter Tip: Track in Real-Time 📲",
    message: "Never miss your ride. Tap any route color on the home page to see exactly where your bus is on the map right now.",
    priority: "low",
    buses: ["Blue", "Green", "Gold", "Purple", "Red", "Orange", "Brown"]
  }
]

export default function NotificationsPage() {
  const [alerts] = useState(initialAlerts)

  return (
    <div className="flex flex-col items-center justify-center h-full text-black text-xl gap-4">
      <h1 className="text-2xl font-bold">Alerts</h1>
      <div className="p-4 flex flex-col gap-3">
        {alerts ? alerts.map((alert, index) => (
          <AlertPill
            key={index}
            subject={alert.subject}
            message={alert.message}
            priority={alert.priority}
            buses={alert.buses}
          />
        )) : "No New Alerts"}
      </div>
    </div>
  
  )
}
import { Routes,Route } from "react-router-dom"
import Tasks from "./pages/Tasks"
import Habits from "./pages/Habits"
import Navbar from "./components/Navbar"
import AuthForm from "./pages/AuthForm"
import VerifyUser from "./pages/VerifyUser"
import Dashboard from "./pages/Dashboard"
import HomePage from "./pages/HomePage"
import NextDayPlanner from "./components/NextDayPlanner"
import TodayView from "./components/TodayView"
import Notifications from "./pages/Notifications"
import Notes from "./pages/Notes"

function App() {

  return (
    <div className="w-screen bg-[#f6fdf4] min-h-screen overflow-hidden">
   <Routes>
          <Route path="/" element={<Navbar />}>
      <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<AuthForm type="signin" />} />

      <Route path="/signup" element={<AuthForm type="signup" />} />
<Route path="/verify-email/:verificationToken" element={<VerifyUser/>}/>
  <Route path="/tasks" element={<Tasks />} />
  <Route path="/habits" element={<Habits />} /> {/* updated */}
    <Route path="/dashboard" element={<Dashboard />} />
<Route path="/plan-next-day" element={<NextDayPlanner/>}/>
<Route path="/today" element={<TodayView/>}/>
<Route path="/notes" element={<Notes/>}/>

<Route path="/notifications" element={<Notifications/>}/>
  </Route>
   </Routes>
    </div>
  )
}

export default App

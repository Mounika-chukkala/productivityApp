import { Routes,Route } from "react-router-dom"
import Tasks from "./pages/Tasks"
import Habits from "./pages/Habits"
import Notes from "./pages/Notes"
import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import AuthForm from "./pages/AuthForm"
import VerifyUser from "./pages/VerifyUser"

function App() {

  return (
    <div className="w-screen min-h-screen overflow-hidden">
   <Routes>
          <Route path="/" element={<Navbar />}>
      <Route path="/" element={<Home />} />
            <Route path="/signin" element={<AuthForm type="signin" />} />

      <Route path="/signup" element={<AuthForm type="signup" />} />
<Route path="/verify-email/:verificationToken" element={<VerifyUser/>}/>
  <Route path="/tasks" element={<Tasks />} />
  <Route path="/habits" element={<Habits />} /> {/* updated */}
  <Route path="/notes" element={<Notes />} />
  </Route>
   </Routes>
    </div>
  )
}

export default App

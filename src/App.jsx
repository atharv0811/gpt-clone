import { useState } from "react";
import Chatbox from "./components/ChatBox"
import Sidebar from "./components/Sidebar"
import Topbar from "./components/Topbar"

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="d-flex screen">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="main">
        <Topbar setIsSidebarOpen={setIsSidebarOpen} />
        <Chatbox />
      </main>
    </div>
  )
}

export default App

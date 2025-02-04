import { Menu } from "lucide-react"

const Topbar = ({ setIsSidebarOpen }) => {
    return (
        <div className="w-100 px-3 py-2 mb-2 text-white d-flex align-items-center gap-2 topbar">
            <Menu className="menu" onClick={() => setIsSidebarOpen(true)} />
        </div>
    )
}

export default Topbar
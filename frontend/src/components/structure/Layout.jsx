import React, { useEffect, useState } from "react"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { verifyToken } from "../../utils/verifyToken"
import Sidebar from "./Sidebar"

export function Layout() {
    const [showHistoryDropdown, setShowHistoryDropdown] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    
    const navigate = useNavigate()
    
        useEffect(() => {
            const checkToken = async () => {
                const isValid = await verifyToken()
                if (!isValid) {
                    localStorage.removeItem("token")
                    navigate("/")
                }
            }
    
            checkToken()
        }, [navigate])

    return (
        <div className={`app-layout ${isSidebarOpen ? "sidebar-open" : ""}`}>
            <div className="shift-container">
                <header className="app-header">
                    <div className="header-content">
                        <h1>FutureSpace AI</h1>
                        <nav>
                            <Link to="/prowriter">Pro Writer</Link>
                            <Link to="/protected">Generate Challenge</Link>
                            <div 
                                className="nav-dropdown"
                                onMouseEnter={() => setShowHistoryDropdown(true)}
                                onMouseLeave={() => setShowHistoryDropdown(false)}
                            >
                                <button
                                    className="nav-dropdown-toggle"
                                    style={showHistoryDropdown ? { color: 'grey', cursor: 'default', opacity: 0.6 } : {}}
                                >
                                    History ▾
                                </button>

                                {showHistoryDropdown && (
                                    <div className="nav-dropdown-menu">
                                        <Link to="/challenge-history">Challenge History</Link>
                                        <Link to="/write-history">Pro Writer History</Link>
                                    </div>
                                )}
                            </div>
                            <Link to="/myprofile">My Profile</Link>
                            <button 
                                onClick={() => {
                                    localStorage.removeItem('token')
                                    navigate('/')
                                }}
                                className="header-user"
                            >
                                Log Out
                            </button>
                        </nav>
                    </div>
                </header>

                <main className="app-main">
                    <Outlet />
                </main>
            </div>
            
            <button
                className="sidebar-toggle"
                onClick={() => {
                    if (isSidebarOpen) {
                        setIsSidebarOpen(false);
                    } else {
                        setIsSidebarOpen(true);
                    }
                }}
            >
                {isSidebarOpen ? "→" : "←"}
            </button>

            <Sidebar isOpen={isSidebarOpen}/>
            
        </div>
    )
}

export default Layout

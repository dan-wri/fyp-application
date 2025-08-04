import React, { useEffect } from "react"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { useState } from "react"

export function Layout() {
    const [showHistoryDropdown, setShowHistoryDropdown] = useState(false)
    
    const navigate = useNavigate()
    
        useEffect(() => {
            const verifyToken = async () => {
                const token = localStorage.getItem('token')
                console.log(token)
                try {
                    const response = await fetch(`http://localhost:8000/verify-token/${token}`)
    
                    if (!response.ok) {
                        throw new Error('Token verification failed')
                    }
                } catch (error) {
                    console.error(error)
                    localStorage.removeItem('token')
                    navigate('/')
                }
            }
    
            verifyToken()
        }, [navigate])

    return (
        <div className="app-layout">
            <header className="app-header">
                <div className="header-content">
                    <h1>FutureSpace AI</h1>
                    <nav>
                        <Link to="/write">Pro Writer</Link>
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
                        <Link to="/profile">My Profile</Link>
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
    )
}

export default Layout

import React from "react";

const Sidebar = ({ isOpen }) => {
    return (
        <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
            <div className="sidebar-header">
                <div className="left">
                <p>Add Friends</p>
            </div>
            <div className="right">
                <p>View Friends</p>
            </div>
            </div>
            <div className="sidebar-content">
                <p>Sidebar content appears here!</p>
            </div>
        </div>
    )
}

export default Sidebar
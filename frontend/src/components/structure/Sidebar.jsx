import React, { useState } from "react";
import AddFriends from "./sidebar-content/AddFriends";
import ViewFriends from "./sidebar-content/ViewFriends";

const Sidebar = ({ isOpen }) => {
    const [activeTab, setActiveTab] = useState("addFriends");

    return (
        <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
            <div className="sidebar-header">
                <div className="left">
                    <button className={activeTab === "addFriends" ? "active" : ""} onClick={() => setActiveTab("addFriends")}>Add Friends</button>
                </div>
                <div className="right">
                    <button className={activeTab === "viewFriends" ? "active" : ""} onClick={() => setActiveTab("viewFriends")}>View Friends</button>
                </div>
            </div>

            <div className="sidebar-content">
                {activeTab === "addFriends" && <AddFriends />}
                {activeTab === "viewFriends" && <ViewFriends />}
            </div>
        </div>
    )
}

export default Sidebar
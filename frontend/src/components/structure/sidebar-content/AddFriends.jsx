import React, { useState, useEffect } from "react";

const AddFriends = () => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchUsers(search);
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [search]);

    const fetchUsers = async (query = "") => {
        const token = localStorage.getItem("token");

        try {
            const url = query
                ? `http://localhost:8000/user/search-users?query=${encodeURIComponent(query)}`
                : "http://localhost:8000/user/random-users";
            
            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP ${response.status}`);
            }

            const data = await response.json();
            setUsers(data);
            setError("");
        } catch (error) {
            console.error("Failed to fetch users:", error);
            setError(`Failed to fetch users: ${error.message}`);
        }
    };

    return (
        <div className="add-friends">
            <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="user-list">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user.id} className="user-item">
                            {user.username}
                        </div>
                    ))
                ) : (
                    !error && <p>No users found</p>
                )}
            </div>
        </div>
    );
};

export default AddFriends;

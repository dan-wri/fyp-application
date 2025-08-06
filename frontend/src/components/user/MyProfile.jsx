import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function MyProfile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch('http://localhost:8000/get-user-details', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else if (response.status === 403 || response.status === 401) {
                    setError('Unauthorized. Please log in again.');
                    localStorage.removeItem('token');
                    navigate('/');
                } else {
                    const errorData = await response.json();
                    setError(errorData.detail || 'Failed to fetch user details.');
                }
            } catch (error) {
                setError('Server error. Please try again later.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [navigate]);

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return ( 
        <div className='profile-container'>
            <div className="profile-left">
                <img
                    className="profile-picture"
                    src={user.profile_picture || 'https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg'}
                    alt="User Profile"
                />
                <ul className="profile-info">
                    <li>
                        <div className="info-label">Full Name:</div>
                        <div className="info-value">{user.username || 'N/A'}</div>
                    </li>
                    <li>
                        <div className="info-label">Age:</div>
                        <div className="info-value">{user.age || 'N/A'}</div>
                    </li>
                    <li>
                        <div className="info-label">Pronouns:</div>
                        <div className="info-value">{user.pronouns || 'N/A'}</div>
                    </li>
                    <li>
                        <div className="info-label">Gender:</div>
                        <div className="info-value">{user.gender || 'N/A'}</div>
                    </li>
                    <li>
                        <div className="info-label">Address:</div>
                        <div className="info-value">{user.address || 'N/A'}</div>
                    </li>
                </ul>
            </div>

            <div className="profile-right">
                <h1 className="username">
                    {user.username}
                    <span className="username-normal">{"'s profile"}</span>
                </h1>
                <p className="email">{user.email}</p>

                <p className="bio"><div className='info-label'>About Me:</div>{(user.bio || 'No bio provided.').split('\n').map((line, index) => (
                    <span key={index}>
                        {line}
                        <br />
                    </span>
                ))}</p>

            </div>
        </div> )
}

export default MyProfile
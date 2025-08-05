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
                    navigate('/login');
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
        <div>
            <li><strong>Email:</strong> {user.email}</li>
            <li><strong>Username:</strong> {user.username || 'N/A'}</li>
            <li><strong>Age:</strong> {user.age || 'N/A'}</li>
            <li><strong>Pronouns:</strong> {user.pronouns || 'N/A'}</li>
            <li><strong>Gender:</strong> {user.gender || 'N/A'}</li>
            <li><strong>Bio:</strong> {user.bio || 'N/A'}</li>
            <li><strong>Address:</strong> {user.address || 'N/A'}</li>
        </div> )
}

export default MyProfile
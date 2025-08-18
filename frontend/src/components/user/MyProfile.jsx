import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function MyProfile() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [usernameWidth, setUsernameWidth] = useState(0);
    const measureRef = useRef();
    const bioRef = useRef(null);
    const [usernameError, setUsernameError] = useState('');
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch('http://localhost:8000/user/get-user-details', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    setFormData(data);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const checkUsername = useCallback(async () => {
        if (!isEditing) return;
        if (formData.username === user.username) {
            setIsUsernameAvailable(true);
            setUsernameError('');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/user/check-username?username=${encodeURIComponent(formData.username)}`);
            const data = await response.json();

            if (!data.available) {
                setIsUsernameAvailable(false);
                setUsernameError('This username is already taken.');
            } else {
                setIsUsernameAvailable(true);
                setUsernameError('');
            }
        } catch {
            setIsUsernameAvailable(false);
            setUsernameError('Could not verify username availability. Please try again.');
        }
    }, [formData.username, isEditing, user?.username]);

    useEffect(() => {
        if (!user || !formData.username) return;

        const debounce = setTimeout(checkUsername, 500);
        return () => clearTimeout(debounce);
    }, [checkUsername, formData.username, user]);

    const handleSave = async () => {
        await checkUsername();
        if (!isUsernameAvailable) {
            setError('Username Unavaliable. Please choose another username.');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:8000/user/set-user-details', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to update profile');
            }

            const updated = await response.json();
            setUser(prev => ({ ...prev, ...updated }));
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    useEffect(() => {
        if (measureRef.current) {
            setUsernameWidth(measureRef.current.offsetWidth);
        }
    }, [formData.username, isEditing]);

    useEffect(() => {
        if (bioRef.current) {
            bioRef.current.style.height = 'auto';
            bioRef.current.style.height = Math.min(bioRef.current.scrollHeight, 200) + 'px';
        }
    }, [formData.bio, isEditing]);

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
                    {['full_name', 'age', 'pronouns', 'gender', 'address'].map((field) => (
                        <li key={field}>
                            <div className="info-label">
                                {field.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}:
                            </div>
                            {isEditing ? (
                                <input
                                    className="info-value"
                                    name={field}
                                    value={formData[field] || ''}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div className="info-value">{user[field] || 'N/A'}</div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="profile-right">
                <h1 className="username">
                    {isEditing ? (
                        <>
                            <span
                                ref={measureRef}
                                className="input-measure"
                            >
                                {formData.username || ''}
                            </span>
                            <input
                                style={{ width: `${usernameWidth}px` }}
                                name="username"
                                value={formData.username || ''}
                                onChange={handleChange}
                            />
                        </>
                    ) : (
                        user.username
                    )}
                    <span className="username-normal">{"'s profile"}</span>
                </h1>

                {isEditing && usernameError && (
                    <div style={{ color: 'red', fontSize: '0.9em' }}>{usernameError}</div>
                )}

                <p className="email">{user.email}</p>

                <div>
                    <div className='info-label'>About Me:</div>
                    {isEditing ? (
                        <textarea
                        name="bio"
                        value={formData.bio || ''}
                        onChange={handleChange}
                        ref={bioRef}
                        style={{ width: '100%' }}
                        className="bio-textarea"
                        />
                    ) : (
                        <div className='bio'>
                        {(user.bio || 'No bio provided.').split('\n').map((line, index) => (
                            <span key={index}>{line}<br /></span>
                        ))}
                        </div>
                    )}
                </div>


                <div className="xp-section">
                    <div className="level-text">Level {user.level || 1}</div>
                    <div className="xp-bar-container">
                        <div
                            className="xp-bar-fill"
                            style={{
                                width: `${(user.xp % 5000) / 5000 * 100}%`
                            }}
                        ></div>
                    </div>
                    <div className="xp-text">{user.xp % 5000} / 5000 XP</div>
                </div>

                {isEditing ? (
                    <>
                        <button onClick={handleSave} className='profile-edit-button' style={{marginRight: 10, backgroundColor: isUsernameAvailable ? 'green' : 'grey'}} disabled={!isUsernameAvailable}>Save</button>
                        <button onClick={() => { setIsEditing(false); setFormData(user); }} className='profile-edit-button' style={{backgroundColor: 'grey'}}>Cancel</button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)} className='profile-edit-button'>Edit Profile</button>
                )}
            </div>
        </div>
    );
}

export default MyProfile;


{/* <button onClick={async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/gain-xp?amount=1200', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const updated = await response.json();
    setUser((prev) => ({ ...prev, ...updated }));
}}>Gain 1200 XP</button> */}
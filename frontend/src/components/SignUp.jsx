import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

export function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            navigate('/protected')
        }
    }, [navigate])

    const validateForm = () => {
        if (!email || !password) {
            setError('Email and password are required')
            return false
        }
        setError('')
        return true
    }

    const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    try {
        const registerResponse = await fetch('http://localhost:8000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })

        if (!registerResponse.ok) {
            const errorData = await registerResponse.json()
            setError(errorData.detail || 'Registration failed!')
            setLoading(false)
            return
        }

        const formDetails = new URLSearchParams()
            formDetails.append('username', email)
            formDetails.append('password', password)

        const loginResponse = await fetch('http://localhost:8000/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formDetails,
        })

        setLoading(false)

        if (loginResponse.ok) {
            const data = await loginResponse.json()
            localStorage.setItem('token', data.access_token)
            navigate('/protected')
        } else {
            const errorData = await loginResponse.json()
            setError(errorData.detail || 'Login after registration failed!')
        }

        } catch (error) {
            console.error(error)
            setError('An error occurred. Please try again later.')
            setLoading(false)
        }
    }

    return (
        <div className='login-container'>
            <h2 className='login-container-title'>Sign Up</h2>

            <form action="#" className='login-form' onSubmit={handleSubmit}>
                <div className='login-input-wrapper'>
                    <input type='email' placeholder='Email address' className='login-input-field' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    <i className="material-symbols-rounded">mail</i>
                </div>

                <div className='login-input-wrapper'>
                    <input type={isPasswordShown ? 'text' : 'password'} placeholder='Password' className='login-input-field' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <i className="material-symbols-rounded">lock</i>
                    <i onClick={() => setIsPasswordShown(prevState => !prevState)} className='material-symbols-rounded eye-icon'>
                        {isPasswordShown ? 'visibility' : 'visibility_off'}
                    </i>
                </div>

                <button className='login-button' type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </form>
            
            <p className='login-display-change'>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/') }}>Log in here!</a></p>
        </div>
    )
}

export default SignUp
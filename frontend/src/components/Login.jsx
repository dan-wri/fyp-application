import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import googleicon from '../assets/google.svg'
import linkedinicon from '../assets/linkedin.svg'

export function Login() {
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

        const formDetails = new URLSearchParams()
        formDetails.append('username', email)
        formDetails.append('password', password)

        try {
            const response = await fetch('http://localhost:8000/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formDetails,
            })

            setLoading(false)

            if (response.ok) {
                const data = await response.json()
                localStorage.setItem('token', data.access_token)
                navigate('/protected')
            } else {
                const errorData = await response.json()
                setError(errorData.detail || 'Authentication failed!')
            }
        } catch (error) {
            console.error(error)
            setLoading(false)
            setError('An error occurred. Please try again later.')
        }
    }

    return (
        <div className='login-container'>
            <h2 className='login-container-title'>Log in with</h2>
            <div className='alt-login'>
                <button className='alt-login-button'>
                   <img src={googleicon} alt='Google' className='alt-login-icon'/>
                   Google
                </button>
                <button className='alt-login-button'>
                   <img src={linkedinicon} alt='LinkedIn' className='alt-login-icon'/>
                   LinkedIn
                </button>
            </div>
            <p className='separator'><span>or</span></p>

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
                <a href="#" className='login-forgot-password'>Forgot Password?</a>

                <button className='login-button' type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Log in'}</button>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </form>
            
            <p className='login-display-change'>Don&apos;t have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/signup') }}>Sign up today!</a></p>
        </div>
    )
}

export default Login
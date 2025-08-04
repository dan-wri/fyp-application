// import React, {useEffect} from 'react'
// import {useNavigate} from 'react-router-dom'

export function ProtectedPage() {
    // const navigate = useNavigate()

    // useEffect(() => {
    //     const verifyToken = async () => {
    //         const token = localStorage.getItem('token')
    //         console.log(token)
    //         try {
    //             const response = await fetch(`http://localhost:8000/verify-token/${token}`)

    //             if (!response.ok) {
    //                 throw new Error('Token verification failed')
    //             }
    //         } catch (error) {
    //             console.error(error)
    //             localStorage.removeItem('token')
    //             navigate('/')
    //         }
    //     }

    //     verifyToken()
    // }, [navigate])

    return <div>This is a protected page, only visiable to authenticated users.</div>
}

export default ProtectedPage
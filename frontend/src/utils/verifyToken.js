export async function verifyToken() {
    const token = localStorage.getItem("token")

    if (!token) return false

    try {
        const response = await fetch(`http://localhost:8000/auth/verify-token/${token}`)
        return response.ok
    } catch (error) {
        console.error("Token verification failed:", error)
        return false
    }
}
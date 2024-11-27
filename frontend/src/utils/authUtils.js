import authApi from "../api/authApi"

const authUtils = {
    isAuthenticated: async () => {
        const token = localStorage.getItem('token')
        if (!token) return false
        
        // Handle demo user token
        if (token === 'demo-token') {
            return {
                id: 'demo-id',
                username: 'demo_user',
                displayName: 'Demo User'
            }
        }

        try {
            const res = await authApi.verifyToken()
            return res.user
        } catch {
            return false
        }
    }
}

export default authUtils
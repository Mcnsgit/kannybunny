import axiosClient from "./axiosClient";

const authApi = {
    signup: params => axiosClient.post('auth/signup', params),
    login: params => {
        // Check if it's a demo login
        if (params.username === 'demo_user' && params.password === 'demo123') {
            // Return a mock successful response for demo user
            return Promise.resolve({
                user: {
                    id: 'demo-id',
                    username: 'demo_user',
                    displayName: 'Demo User'
                },
                token: 'demo-token'
            });
        }
        return axiosClient.post('auth/login', params);
    },
    verifyToken: () => axiosClient.post('auth/verify-token')
}

export default authApi
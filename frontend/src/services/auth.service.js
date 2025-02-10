import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login/instructor`, credentials, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data) {
            // Get token from either standard location or headers
            const token = 
                response.data.token || 
                response.data.access_token || 
                response.headers['authorization']?.replace('Bearer ', '');

            if (token) {
                // Store token in multiple locations for compatibility
                localStorage.setItem('token', token);
                localStorage.setItem('userToken', token);

                // Store user data
                const userData = {
                    firstName: response.data?.user?.firstName || '',
                    lastName: response.data?.user?.lastName || '',
                    email: response.data?.user?.email || credentials.email,
                    status: response.data?.user?.status || 'pending',
                    isVerified: response.data?.user?.isVerified || false,
                    role: response.data?.user?.role || 'instructor',
                    ...response.data?.user
                };
                
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                throw new Error('No authentication token found in response');
            }
        }

        return response.data;
    } catch (error) {
        // Clean up any partial auth state
        localStorage.removeItem('token');
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
        throw error;
    }
};

export const validateToken = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await axios.post(`${API_URL}/auth/validate`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
};

export default {
    login,
    validateToken,
    logout
};

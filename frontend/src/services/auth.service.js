import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login/instructor`, {
            email,
            password
        });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    } catch (error) {
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
        localStorage.removeItem('user');
        throw error;
    }
};

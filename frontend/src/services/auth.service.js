import axios from 'axios';

export const login = async (email, password) => {
    try {
        const response = await axios.post('http://localhost:3000/api/instructors/login', {
            email,
            password
        });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }

        return response.data;
    } catch (error) {
        throw error;
    }
}; 
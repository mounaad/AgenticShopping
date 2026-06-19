import api from './api';

const authService = {
    register: async (data) => {
        const response = await api.post('/api/users/register', data);
        return response.data;
    },

    login: async (data) => {
        const response = await api.post('/api/users/login', data);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user') || 'null');
    },
};

export default authService;
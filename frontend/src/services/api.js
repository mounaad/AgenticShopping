import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8088',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Ajouter le token automatiquement à chaque requête
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default api;
import api from './api';

const productService = {
    getAll: async () => {
        const response = await api.get('/api/products');
        return response.data;
    },

    search: async (keyword, maxPrice) => {
        let url = `/api/products/search?q=${keyword}`;
        if (maxPrice) url += `&maxPrice=${maxPrice}`;
        const response = await api.get(url);
        return response.data;
    },

    getByCategory: async (category) => {
        const response = await api.get(`/api/products/category/${category}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/api/products/${id}`);
        return response.data;
    },
};

export default productService;
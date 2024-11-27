import axios from "axios";

const Api = axios.create({
    baseURL: process.env.REACT_APP_API || 'http://localhost:3001',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor
Api.interceptors.request.use(
    (config) => {
        // Add any request preprocessing here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
Api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.data.error === "Erro na API, token inválido.") {
            localStorage.removeItem('user_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default Api;
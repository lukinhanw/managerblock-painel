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
        if (error.response) {
            // Server responded with error status
            return Promise.reject(error.response);
        } else if (error.request) {
            // Request made but no response received
            return Promise.reject({
                data: {
                    error: "No response from server. Please check your connection."
                }
            });
        } else {
            // Error in request setup
            return Promise.reject({
                data: {
                    error: "Error setting up request."
                }
            });
        }
    }
);

export default Api;
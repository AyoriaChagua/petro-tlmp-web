import axios, { AxiosInstance } from 'axios';


export const getApiBaseUrl = () => {
    const currentURL = window.location.hostname;
    console.log(currentURL)
    if ((currentURL === "localhost" || currentURL === "127.0.0.1") || currentURL === "192.168.1.12") {
        // return "http://localhost:4500/api";
        //return "http://190.116.6.12:4500/api";
        return "http://192.168.1.12:4500/api";
    } else {
        return "http://190.116.6.12:4500/api"
    }
}

export const axiosInstance = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
    withCredentials: true,
});


export const axiosAuthInstance: AxiosInstance = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
    withCredentials: true,
});

axiosAuthInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

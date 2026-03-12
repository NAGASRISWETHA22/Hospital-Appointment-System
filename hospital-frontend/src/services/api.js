import axios from 'axios';

const API = axios.create({
    baseURL: 'https://hospital-appointment-system-1o4k.onrender.com/api',
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

export default API;
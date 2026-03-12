import api from './api';

// Path changed to /auth/doctors to match AuthController
export const getAllDoctors = () => {
    return api.get('/auth/doctors');
};

export const login = (credentials) => {
    return api.post('/auth/login', credentials);
};

export const register = (userData) => {
    return api.post('/auth/register', userData);
};

export const registerDoctor = (doctorData) => {
    return api.post('/auth/register', {
        ...doctorData,
        role: 'DOCTOR'
    });
};

export const deleteUser = (id) => {
    return api.delete(`/auth/delete/${id}`);
};
import api from './api';

export const getDashboardStats = () => {
    return api.get('/analytics/dashboard');
};

export const getAppointmentsPerDoctor = () => {
    return api.get('/analytics/appointments-per-doctor');
};

export const getRevenuePerDepartment = () => {
    return api.get('/analytics/revenue-per-department');
};

import api from './api';

export const getAllDepartments = () => {
    return api.get('/departments');
};

export const createDepartment = (deptData) => {
    return api.post('/departments', deptData);
};

export const deleteDepartment = (id) => {
    return api.delete(`/departments/${id}`);
};

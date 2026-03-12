import api from './api';

export const addReview = (reviewData) => {
    return api.post('/reviews', reviewData);
};

export const getReviewsByDoctor = (doctorId) => {
    return api.get(`/reviews/doctor/${doctorId}`);
};

export const deleteReview = (id) => {
    return api.delete(`/reviews/${id}`);
};

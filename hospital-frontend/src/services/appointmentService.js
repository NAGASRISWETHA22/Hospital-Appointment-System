import API from './api';

// --- PATIENT FEATURES ---
// 1. New appointment book panna
export const bookAppointment = (data) => API.post('/appointments/book', data);

// 2. Patient-oda history fetch panna (Fix for empty history issue)
export const getPatientHistory = (patientId) => API.get(`/appointments/patient/${patientId}`);

// 3. Patient appointment-a cancel panna
// Backend supports unified status update endpoint
export const cancelAppointment = (appointmentId) =>
    API.put(`/appointments/status/${appointmentId}?status=CANCELLED`);


// --- DOCTOR FEATURES ---
// 4. Doctor-oda full schedule-a paaka
export const getDoctorSchedule = (doctorId) => API.get(`/appointments/doctor/${doctorId}`);

// 5. Appointment status-a update panna (Confirm/Reject/Complete)
// Status values: 'CONFIRMED', 'CANCELLED', 'COMPLETED'
export const updateAppointmentStatus = (id, status) => 
    API.put(`/appointments/status/${id}?status=${status}`);


// --- ADMIN FEATURES ---
// 6. System-la irukura ella appointments-aiyum paaka
export const getAllAppointments = () => API.get('/appointments/all');

// 7. Admin cancel panna (Override power)
export const adminCancelAppointment = (id) => API.delete(`/appointments/delete/${id}`);

// 8. Revenue or Analytics-kaga report fetch panna (Optional/Future)
export const getAppointmentReports = () => API.get('/appointments/reports/analytics');
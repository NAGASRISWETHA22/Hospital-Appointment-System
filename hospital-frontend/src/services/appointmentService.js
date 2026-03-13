import API from './api';

// --- PATIENT FEATURES ---
export const bookAppointment = (data) => API.post('/appointments/book', data);

// used for both patient history and doctor schedule
export const getPatientHistory = (patientId) => API.get(`/appointments/patient/${patientId}`);

// cancel appointment - patient or doctor can cancel, but status update is unified
// Backend supports unified status update endpoint
export const cancelAppointment = (appointmentId) =>
    API.put(`/appointments/status/${appointmentId}?status=CANCELLED`);


// --- DOCTOR FEATURES ---
// 4. to see the schedule of appointments for a doctor (for doctor dashboard)
export const getDoctorSchedule = (doctorId) => API.get(`/appointments/doctor/${doctorId}`);

// 5. update the appointment status (e.g., mark as completed after consultation)
// Status values: 'CONFIRMED', 'CANCELLED', 'COMPLETED'
export const updateAppointmentStatus = (id, status) => 
    API.put(`/appointments/status/${id}?status=${status}`);


// --- ADMIN FEATURES ---
// 6. to see the list of all appointments (for admin dashboard)
export const getAllAppointments = () => API.get('/appointments/all');

// 7. to cancel any appointment (for admin)
export const adminCancelAppointment = (id) => API.delete(`/appointments/delete/${id}`);

// 8. for revenue reports, analytics, etc. (for admin)
export const getAppointmentReports = () => API.get('/appointments/reports/analytics');
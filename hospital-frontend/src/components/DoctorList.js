import React, { useState, useEffect, useContext } from 'react';
import { getAllDoctors } from '../services/userService';
import { AuthContext } from '../context/AuthContext';
import { bookAppointment } from '../services/appointmentService';
import { getAllDepartments } from '../services/departmentService';
import { getReviewsByDoctor } from '../services/reviewService';
import API from '../services/api';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [viewingProfile, setViewingProfile] = useState(null);
    const [doctorReviews, setDoctorReviews] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [fetchingSlots, setFetchingSlots] = useState(false);
    const { user } = useContext(AuthContext);

    // Booking state
    const [bookingData, setBookingData] = useState({
        date: '',
        slot: null
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [docRes, deptRes] = await Promise.all([
                getAllDoctors(),
                getAllDepartments()
            ]);
            setDoctors(docRes.data || []);
            setDepartments(deptRes.data || []);
        } catch (err) {
            console.error("Failed to fetch data:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctorProfile = async (doctor) => {
        setViewingProfile(doctor);
        try {
            const res = await getReviewsByDoctor(doctor.id);
            setDoctorReviews(res.data || []);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
            setDoctorReviews([]);
        }
    };

    const fetchSlotsForDate = async (doctorId, date) => {
        if (!date) return;
        setFetchingSlots(true);
        try {
            const res = await API.get(`/availability/doctor/${doctorId}/date?date=${date}`);
            // Check both 'booked' and 'isBooked' to be safe
            setAvailableSlots(res.data.filter(s => s.booked === false || s.isBooked === false));
        } catch (err) {
            console.error("Failed to fetch slots:", err);
            setAvailableSlots([]);
        } finally {
            setFetchingSlots(false);
        }
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!bookingData.slot) {
            alert("Please select a time slot!");
            return;
        }

        const requestBody = {
            patientId: user.id,
            doctorId: selectedDoctor.id,
            date: bookingData.date,
            startTime: bookingData.slot.startTime,
            endTime: bookingData.slot.endTime
        };

        try {
            console.log("Booking Request:", requestBody);
            await bookAppointment(requestBody);
            alert(`Appointment requested with ${selectedDoctor.name}!`);
            setSelectedDoctor(null); // Modal-a close panna
        } catch (err) {
            alert("Booking failed: " + (err.response?.data || err.message));
        }
    };

    // Filter doctors based on search (Name or Specialization) and Department
    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (doctor.specialization && doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesDept = selectedDept === '' || doctor.department?.id === parseInt(selectedDept);
        return matchesSearch && matchesDept;
    });

    if (loading) return <p className="loading-text">Loading doctors...</p>;

    return (
        <div className="info-section">
            <div className="section-header">
                <h3>Available Doctors</h3>
                <div className="filter-group" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <select 
                        className="dept-filter"
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                    <input 
                        type="date"
                        className="date-filter"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                    <input 
                        type="text" 
                        placeholder="Search by name or specialization..." 
                        className="search-bar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1, minWidth: '200px' }}
                    />
                </div>
            </div>

            <table className="doctor-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Specialization</th>
                        <th>Department</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map(doctor => (
                            <tr key={doctor.id}>
                                <td onClick={() => fetchDoctorProfile(doctor)} style={{ cursor: 'pointer', color: '#1e40af', fontWeight: 'bold' }}>
                                    {doctor.name}
                                </td>
                                <td>{doctor.specialization || 'General'}</td>
                                <td>{doctor.department?.name || 'General'}</td>
                                <td>
                                    <button 
                                        className="book-btn"
                                        onClick={() => {
                                            setSelectedDoctor(doctor);
                                            setAvailableSlots([]);
                                            setBookingData({ date: '', slot: null });
                                        }}
                                    >
                                        Book Appointment
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4" style={{textAlign: 'center'}}>No doctors found.</td></tr>
                    )}
                </tbody>
            </table>

            {/* Doctor Profile Modal */}
            {viewingProfile && (
                <div className="modal-overlay">
                    <div className="booking-modal profile-modal" style={{ width: '600px' }}>
                        <div className="profile-header" style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                            <h4>Dr. {viewingProfile.name}</h4>
                            <p className="role-badge">{viewingProfile.specialization}</p>
                            <p style={{ color: '#64748b', fontSize: '14px' }}>{viewingProfile.department?.name} Department</p>
                        </div>
                        
                        <div className="reviews-section">
                            <h5>Patient Reviews</h5>
                            <div className="reviews-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {doctorReviews.length > 0 ? (
                                    doctorReviews.map(review => (
                                        <div key={review.id} className="review-item" style={{ padding: '10px', borderBottom: '1px solid #f8fafc' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontWeight: '600', fontSize: '14px' }}>{review.patient?.name}</span>
                                                <span style={{ color: '#f59e0b' }}>{"★".repeat(review.rating)}</span>
                                            </div>
                                            <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#475569' }}>{review.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px' }}>No reviews yet.</p>
                                )}
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button 
                                className="cancel-btn" 
                                onClick={() => setViewingProfile(null)}
                            >
                                Close Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Simple Booking Modal Overlay */}
            {selectedDoctor && (
                <div className="modal-overlay">
                    <div className="booking-modal">
                        <h4>Book with {selectedDoctor.name}</h4>
                        <form onSubmit={handleBookingSubmit}>
                            <div className="form-group">
                                <label>Date:</label>
                                <input 
                                    type="date" 
                                    required 
                                    min={new Date().toISOString().split('T')[0]} // Future date constraint
                                    value={bookingData.date}
                                    onChange={(e) => {
                                        const date = e.target.value;
                                        setBookingData({...bookingData, date, slot: null});
                                        fetchSlotsForDate(selectedDoctor.id, date);
                                    }}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Available Slots:</label>
                                {fetchingSlots ? (
                                    <p>Loading slots...</p>
                                ) : (
                                    <div className="slot-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '10px' }}>
                                        {availableSlots.length > 0 ? (
                                            availableSlots.map(slot => (
                                                <button
                                                    key={slot.id}
                                                    type="button"
                                                    className={`slot-btn ${bookingData.slot?.id === slot.id ? 'selected' : ''}`}
                                                    onClick={() => setBookingData({...bookingData, slot})}
                                                    style={{
                                                        padding: '10px',
                                                        border: bookingData.slot?.id === slot.id ? '2px solid #007bff' : '1px solid #ddd',
                                                        backgroundColor: bookingData.slot?.id === slot.id ? '#e7f1ff' : '#fff',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {slot.startTime} - {slot.endTime}
                                                </button>
                                            ))
                                        ) : (
                                            <p style={{ color: '#666' }}>{bookingData.date ? 'No slots available for this date.' : 'Please select a date first.'}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="modal-actions" style={{ marginTop: '20px' }}>
                                <button type="submit" className="confirm-btn" disabled={!bookingData.slot}>Confirm Booking</button>
                                <button 
                                    type="button" 
                                    className="cancel-btn"
                                    onClick={() => setSelectedDoctor(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorList;
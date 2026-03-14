import React, { useState, useEffect, useContext, useMemo } from 'react';
import { getAllDoctors } from '../services/userService';
import { AuthContext } from '../context/AuthContext';
import { bookAppointment } from '../services/appointmentService';
import { getAllDepartments } from '../services/departmentService';
import { getReviewsByDoctor } from '../services/reviewService';
import API from '../services/api';

const DoctorList = () => {
    const { user } = useContext(AuthContext);
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

    const [bookingData, setBookingData] = useState({
        date: '',
        slot: null
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    // Effect to fetch doctors specifically available on a certain date
    useEffect(() => {
        if (searchDate) {
            handleDateSearch();
        } else {
            fetchAllDoctorsOnly();
        }
    }, [searchDate]);

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
            console.error("Failed to fetch initial data:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllDoctorsOnly = async () => {
        try {
            const res = await getAllDoctors();
            setDoctors(res.data || []);
        } catch (err) {
            console.error("Failed to fetch doctors:", err);
        }
    };

    const handleDateSearch = async () => {
        setLoading(true);
        try {
            // Updated endpoint to match standard availability search
            const res = await API.get(`/api/availability/available-on?date=${searchDate}`);
            setDoctors(res.data || []);
        } catch (err) {
            console.error("Failed to fetch doctors by date:", err);
            setDoctors([]); 
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
            const res = await API.get(`/api/availability/doctor/${doctorId}/date?date=${date}`);
            // Logic Fix: Only show slots that are specifically marked as NOT booked
            setAvailableSlots(res.data.filter(s => !s.booked));
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
            await bookAppointment(requestBody);
            alert(`Appointment requested successfully with Dr. ${selectedDoctor.name}!`);
            setSelectedDoctor(null); 
            setBookingData({ date: '', slot: null });
        } catch (err) {
            alert("Booking failed: " + (err.response?.data || err.message));
        }
    };

    // useMemo for performance: Only re-calculates when search/filters change
    const filteredDoctors = useMemo(() => {
        return doctors.filter(doctor => {
            const name = doctor.name?.toLowerCase() || "";
            const spec = doctor.specialization?.toLowerCase() || "";
            const term = searchTerm.toLowerCase();

            const matchesSearch = name.includes(term) || spec.includes(term);
            const matchesDept = selectedDept === '' || doctor.department?.id === parseInt(selectedDept);
            
            return matchesSearch && matchesDept;
        });
    }, [doctors, searchTerm, selectedDept]);

    if (loading) return <div className="loading-spinner">Loading doctor information...</div>;

    return (
        <div className="info-section">
            <div className="section-header-modern">
                <div className="sh-title">
                    <h3>Available Doctors</h3>
                    <p>Find the best medical experts for your needs</p>
                </div>
                <div className="filter-shelf">
                    <div className="filter-item">
                        <label>Department</label>
                        <select 
                            className="premium-select"
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                        >
                            <option value="">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-item">
                        <label>Date Availability</label>
                        <input 
                            type="date"
                            className="premium-date"
                            value={searchDate}
                            onChange={(e) => setSearchDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div className="filter-item search-box">
                        <label>Quick Search</label>
                        <input 
                            type="text" 
                            placeholder="Name or specialty..." 
                            className="premium-search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="doctor-grid">
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map(doctor => (
                        <div key={doctor.id} className="doctor-card">
                            <div className="doc-card-header">
                                <h4 onClick={() => fetchDoctorProfile(doctor)} className="doc-name">{doctor.name}</h4>
                                <span className="doc-specialty">{doctor.specialization || 'General Practitioner'}</span>
                            </div>
                            <div className="doc-card-body">
                                <p className="doc-dept">
                                    <i className="dept-icon">🏢</i> {doctor.department?.name || 'General Clinic'}
                                </p>
                            </div>
                            <div className="doc-card-footer">
                                <button className="book-btn-modern" onClick={() => {
                                    setSelectedDoctor(doctor);
                                    setAvailableSlots([]);
                                    setBookingData({ date: '', slot: null });
                                }}>Book Appointment</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">No doctors match your criteria.</div>
                )}
            </div>

            {/* Profile Modal */}
            {viewingProfile && (
                <div className="modal-overlay" onClick={() => setViewingProfile(null)}>
                    <div className="booking-modal profile-modal premium-modal" onClick={e => e.stopPropagation()}>
                        <div className="pm-header">
                            <div className="pm-title-area">
                                <h4>Dr. {viewingProfile.name}</h4>
                                <span className="role-badge">{viewingProfile.specialization || 'General'}</span>
                            </div>
                            <p className="pm-dept">{viewingProfile.department?.name} Department</p>
                        </div>
                        
                        <div className="reviews-section">
                            <h5>Patient Reviews</h5>
                            <div className="reviews-list">
                                {doctorReviews.length > 0 ? (
                                    doctorReviews.map(review => (
                                        <div key={review.id} className="review-item">
                                            <div className="review-header">
                                                <span className="reviewer-name">{review.patient?.name}</span>
                                                <span className="stars">{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</span>
                                            </div>
                                            <p className="review-text">{review.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-reviews">No reviews yet for this doctor.</div>
                                )}
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setViewingProfile(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Booking Modal */}
            {selectedDoctor && (
                <div className="modal-overlay" onClick={() => setSelectedDoctor(null)}>
                    <div className="booking-modal premium-modal" onClick={e => e.stopPropagation()}>
                        <div className="pm-header">
                            <h4>Book with Dr. {selectedDoctor.name}</h4>
                            <p className="pm-subtitle">Select your preferred time slot</p>
                        </div>
                        <form onSubmit={handleBookingSubmit} className="booking-form">
                            <div className="form-group modern-input-group">
                                <label>Appointment Date</label>
                                <input type="date" required 
                                    min={new Date().toISOString().split('T')[0]} 
                                    value={bookingData.date}
                                    onChange={(e) => {
                                        const date = e.target.value;
                                        setBookingData({...bookingData, date, slot: null});
                                        fetchSlotsForDate(selectedDoctor.id, date);
                                    }}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Available Slots</label>
                                {fetchingSlots ? (
                                    <div className="loading-spinner">Fetching slots...</div>
                                ) : (
                                    <div className="slot-grid modern-slot-grid">
                                        {availableSlots.length > 0 ? (
                                            availableSlots.map(slot => (
                                                <button key={slot.id} type="button"
                                                    className={`slot-pill ${bookingData.slot?.id === slot.id ? 'selected' : ''}`}
                                                    onClick={() => setBookingData({...bookingData, slot})}
                                                >
                                                    {slot.startTime.substring(0,5)} - {slot.endTime.substring(0,5)}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="empty-slots">
                                                {bookingData.date ? 'No free slots on this day.' : 'Select a date to view slots.'}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="modal-actions row-actions">
                                <button type="button" className="cancel-btn" onClick={() => setSelectedDoctor(null)}>Cancel</button>
                                <button type="submit" className="confirm-btn" disabled={!bookingData.slot}>Confirm Booking</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorList;
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
    const [sourceForFiltering, setSourceForFiltering] = useState([]);
    const [dateFilteredDoctors, setDateFilteredDoctors] = useState([]);
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

    useEffect(() => {
        if (searchDate) {
            handleDateSearch();
        } else {
            setSourceForFiltering(doctors); // Reset to all doctors if date is cleared
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
            setSourceForFiltering(docRes.data || []); // Initialize source
            setDepartments(deptRes.data || []);
        } catch (err) {
            console.error("Failed to fetch data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDateSearch = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/doctors/available-on?date=${searchDate}`);
            setSourceForFiltering(res.data || []);
        } catch (err) {
            console.error("Failed to fetch doctors by date:", err);
            setSourceForFiltering([]); // Clear results on error
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
    const filteredDoctors = sourceForFiltering.filter(doctor => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (doctor.specialization && doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesDept = selectedDept === '' || doctor.department?.id === parseInt(selectedDept);
        return matchesSearch && matchesDept;
    });

    if (loading) return <p className="loading-text">Loading doctors...</p>;

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
                        <label>Availability</label>
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
                                <span className="doc-specialty">{doctor.specialization || 'General'}</span>
                            </div>
                            <div className="doc-card-body">
                                <p className="doc-dept">
                                    <i className="dept-icon">🏢</i> {doctor.department?.name || 'General Department'}
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

            {/* Doctor Profile Modal */}
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
                                    <div className="empty-reviews">No reviews yet.</div>
                                )}
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setViewingProfile(null)}>Close Profile</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Booking Modal Overlay */}
            {selectedDoctor && (
                <div className="modal-overlay" onClick={() => setSelectedDoctor(null)}>
                    <div className="booking-modal premium-modal" onClick={e => e.stopPropagation()}>
                        <div className="pm-header">
                            <h4>Book with {selectedDoctor.name}</h4>
                            <p className="pm-subtitle">Select a suitable date and time</p>
                        </div>
                        <form onSubmit={handleBookingSubmit} className="booking-form">
                            <div className="form-group modern-input-group">
                                <label>Date</label>
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
                                    <div className="loading-spinner">Loading slots...</div>
                                ) : (
                                    <div className="slot-grid modern-slot-grid">
                                        {availableSlots.length > 0 ? (
                                            availableSlots.map(slot => (
                                                <button key={slot.id} type="button"
                                                    className={`slot-pill ${bookingData.slot?.id === slot.id ? 'selected' : ''}`}
                                                    onClick={() => setBookingData({...bookingData, slot})}
                                                >
                                                    {slot.startTime} - {slot.endTime}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="empty-slots">
                                                {bookingData.date ? 'No slots available for this date.' : 'Please select a date first.'}
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
import React, { useState, useEffect } from 'react';
import { getPatientHistory, updateAppointmentStatus } from '../services/appointmentService';
import { addReview } from '../services/reviewService';

const AppointmentHistory = ({ patientId }) => {
    const [history, setHistory] = useState([]);
    const [reviewing, setReviewing] = useState(null);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        fetchHistory();
    }, [patientId]);

    const fetchHistory = async () => {
        try {
            const res = await getPatientHistory(patientId);
            setHistory(res.data);
        } catch (err) { console.error(err); }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            try {
                await updateAppointmentStatus(id, 'CANCELLED');
                alert("Appointment cancelled successfully!");
                fetchHistory();
            } catch (err) {
                alert("Failed to cancel appointment.");
            }
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await addReview({
                patient: { id: patientId },
                doctor: { id: reviewing.doctor.id },
                rating: reviewData.rating,
                comment: reviewData.comment
            });
            alert("Review submitted successfully!");
            setReviewing(null);
            setReviewData({ rating: 5, comment: '' });
        } catch (err) {
            alert("Failed to submit review.");
        }
    };

    return (
        <div className="info-section">
            <div className="section-header">
                <h3>My Appointment History</h3>
            </div>
            
            <div className="availability-grid">
                {history.length > 0 ? (
                    history.map(app => (
                        <div key={app.id} className="availability-card">
                            <div className="card-header">
                                <span className="date-badge">{app.appointmentDate}</span>
                                <span className={`status-pill ${app.status.toLowerCase()}`}>{app.status}</span>
                            </div>
                            <div className="card-body">
                                <h4 className="doc-name" style={{margin: '0 0 10px 0'}}>Dr. {app.doctor.name}</h4>
                                <div className="time-range">
                                    <span className="time-block">Start: <b>{app.startTime}</b></span>
                                    <span className="time-block">End: <b>{app.endTime}</b></span>
                                </div>
                            </div>
                            <div className="card-footer" style={{ display: 'flex', gap: '10px' }}>
                                {(app.status === 'PENDING' || app.status === 'CONFIRMED') && (
                                    <button className="delete-btn-modern" onClick={() => handleCancel(app.id)}>
                                        Cancel Booking
                                    </button>
                                )}
                                {app.status === 'COMPLETED' && (
                                    <button className="book-btn-modern" onClick={() => setReviewing(app)}>
                                        Rate Doctor
                                    </button>
                                )}
                                {(app.status === 'CANCELLED' || app.status === 'REJECTED') && (
                                    <span className="text-muted">No actions available</span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">No appointment history found.</div>
                )}
            </div>

            {reviewing && (
                <div className="modal-overlay" onClick={() => setReviewing(null)}>
                    <div className="booking-modal premium-modal" onClick={e => e.stopPropagation()}>
                        <div className="pm-header">
                            <h4>Rate Dr. {reviewing.doctor.name}</h4>
                            <p className="pm-subtitle">Your feedback helps improve our services</p>
                        </div>
                        <form onSubmit={handleReviewSubmit} className="booking-form">
                            <div className="form-group modern-input-group">
                                <label>Rating (1-5)</label>
                                <input type="number" min="1" max="5" required 
                                    value={reviewData.rating}
                                    onChange={(e) => setReviewData({...reviewData, rating: e.target.value})}
                                />
                            </div>
                            <div className="form-group modern-input-group">
                                <label>Review Comment</label>
                                <textarea required rows="4"
                                    value={reviewData.comment}
                                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                                    placeholder="Write your experience..."
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0', fontFamily: 'inherit', transition: 'border-color 0.2s', resize: 'vertical' }}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>
                            <div className="modal-actions row-actions">
                                <button type="button" className="cancel-btn" onClick={() => setReviewing(null)}>Cancel</button>
                                <button type="submit" className="confirm-btn">Submit Review</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentHistory;
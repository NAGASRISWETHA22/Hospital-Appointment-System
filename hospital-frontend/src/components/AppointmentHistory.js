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
            <h3>My Appointment History</h3>
            <table className="doctor-table">
                <thead>
                    <tr>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map(app => (
                        <tr key={app.id}>
                            <td>{app.doctor.name}</td>
                            <td>{app.appointmentDate}</td>
                            <td>{app.startTime} - {app.endTime}</td>
                            <td><span className={`status-pill ${app.status.toLowerCase()}`}>{app.status}</span></td>
                            <td>
                                {(app.status === 'PENDING' || app.status === 'CONFIRMED') && (
                                    <button 
                                        className="cancel-btn-small"
                                        onClick={() => handleCancel(app.id)}
                                    >
                                        Cancel
                                    </button>
                                )}
                                {app.status === 'COMPLETED' && (
                                    <button 
                                        className="book-btn-small"
                                        onClick={() => setReviewing(app)}
                                    >
                                        Rate Doctor
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {reviewing && (
                <div className="modal-overlay">
                    <div className="booking-modal">
                        <h4>Rate Dr. {reviewing.doctor.name}</h4>
                        <form onSubmit={handleReviewSubmit}>
                            <div className="form-group">
                                <label>Rating (1-5):</label>
                                <input 
                                    type="number" 
                                    min="1" max="5" 
                                    required 
                                    value={reviewData.rating}
                                    onChange={(e) => setReviewData({...reviewData, rating: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Comment:</label>
                                <textarea 
                                    required 
                                    rows="3"
                                    value={reviewData.comment}
                                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="confirm-btn">Submit Review</button>
                                <button 
                                    type="button" 
                                    className="cancel-btn"
                                    onClick={() => setReviewing(null)}
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

export default AppointmentHistory;
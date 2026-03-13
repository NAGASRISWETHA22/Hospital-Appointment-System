import React, { useState, useEffect } from 'react';
import { getDoctorSchedule, updateAppointmentStatus } from '../services/appointmentService';

const DoctorSchedule = ({ doctorId, viewOnly = false }) => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSchedule();
    }, [doctorId]);

    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const res = await getDoctorSchedule(doctorId);
            setSchedule(res.data);
        } catch (err) {
            console.error("Failed to fetch schedule:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            // Backend-la status-a 'CONFIRMED' or 'CANCELLED' nu mathum
            await updateAppointmentStatus(appointmentId, newStatus);
            alert(`Appointment ${newStatus.toLowerCase()} successfully!`);
            fetchSchedule(); // List-a refresh panna
        } catch (err) {
            alert("Error updating status: " + (err.response?.data || err.message));
        }
    };

    if (loading) return <div className="loading-spinner">Loading schedule...</div>;

    return (
        <div className="info-section">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>{viewOnly ? "Today's Overview" : "Manage My Appointments"}</h3>
                {!viewOnly && <button className="add-btn" onClick={fetchSchedule} style={{ padding: '8px 16px', borderRadius: '20px' }}>↻ Refresh</button>}
            </div>

            <div className="availability-grid">
                {schedule.length > 0 ? (
                    schedule.map(app => (
                        <div key={app.id} className="availability-card">
                            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="date-badge">{app.appointmentDate}</span>
                                <span className={`status-pill ${app.status.toLowerCase()}`}>{app.status}</span>
                            </div>
                            <div className="card-body">
                                <h4 className="doc-name" style={{margin: '0 0 5px 0'}}>{app.patient.name}</h4>
                                <p style={{ margin: '0 0 15px 0', color: '#64748b', fontSize: '13px' }}>{app.patient.email}</p>
                                
                                <div className="time-range">
                                    <span className="time-block">Start: <b>{app.startTime}</b></span>
                                    <span className="time-block">End: <b>{app.endTime}</b></span>
                                </div>
                            </div>
                            
                            {!viewOnly && (
                                <div className="card-footer">
                                    {app.status === 'PENDING' && (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button className="book-btn-modern" style={{ flex: 1, backgroundColor: '#10b981' }} onClick={() => handleStatusUpdate(app.id, 'CONFIRMED')}>
                                                Confirm
                                            </button>
                                            <button className="delete-btn-modern" style={{ flex: 1 }} onClick={() => handleStatusUpdate(app.id, 'REJECTED')}>
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                    {app.status === 'CONFIRMED' && (
                                        <button className="book-btn-modern" style={{ width: '100%' }} onClick={() => handleStatusUpdate(app.id, 'COMPLETED')}>
                                            Mark Completed
                                        </button>
                                    )}
                                    {(app.status === 'COMPLETED' || app.status === 'CANCELLED' || app.status === 'REJECTED') && (
                                       <span className="text-muted" style={{ display: 'block', textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>No actions available</span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="empty-state">No appointments found in your schedule.</div>
                )}
            </div>
        </div>
    );
};

export default DoctorSchedule;
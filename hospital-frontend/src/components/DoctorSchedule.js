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
            <div className="section-header">
                <h3>{viewOnly ? "Today's Overview" : "Manage My Appointments"}</h3>
                {!viewOnly && <button className="refresh-btn" onClick={fetchSchedule}>Refresh</button>}
            </div>

            <table className="doctor-table">
                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        {!viewOnly && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {schedule.length > 0 ? (
                        schedule.map(app => (
                            <tr key={app.id}>
                                <td>
                                    <strong>{app.patient.name}</strong><br/>
                                    <small style={{ color: '#666' }}>{app.patient.email}</small>
                                </td>
                                <td>{app.appointmentDate}</td>
                                <td>{app.startTime} - {app.endTime}</td>
                                <td>
                                    <span className={`status-pill ${app.status.toLowerCase()}`}>
                                        {app.status}
                                    </span>
                                </td>
                                {!viewOnly && (
                                    <td>
                                        {app.status === 'PENDING' && (
                                            <div className="action-buttons">
                                                <button 
                                                    className="confirm-btn-small"
                                                    onClick={() => handleStatusUpdate(app.id, 'CONFIRMED')}
                                                >
                                                    Confirm
                                                </button>
                                                <button 
                                                    className="cancel-btn-small"
                                                    onClick={() => handleStatusUpdate(app.id, 'CANCELLED')}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        {app.status === 'CONFIRMED' && (
                                            <button 
                                                className="complete-btn-small"
                                                onClick={() => handleStatusUpdate(app.id, 'COMPLETED')}
                                            >
                                                Mark Completed
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={viewOnly ? "4" : "5"} style={{ textAlign: 'center', padding: '20px' }}>
                                No appointments found in your schedule.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DoctorSchedule;
import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const DoctorAvailabilityManager = () => {
    const { user } = useContext(AuthContext);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newSlot, setNewSlot] = useState({
        availableDate: '',
        startTime: '',
        endTime: ''
    });

    useEffect(() => {
        if (user && user.id) {
            fetchSlots();
        }
    }, [user]);

    const fetchSlots = async () => {
        try {
            const res = await API.get(`/availability/doctor/${user.id}`);
            setSlots(res.data);
        } catch (err) {
            console.error("Failed to fetch slots:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSlot = async (e) => {
        e.preventDefault();
        
        // Validation: End time should be after start time
        if (newSlot.startTime >= newSlot.endTime) {
            alert('End time must be after start time');
            return;
        }

        try {
            // Send flat DTO matching DoctorAvailabilityRequest.java
            await API.post('/availability', {
                doctorId: user.id,
                availableDate: newSlot.availableDate,
                startTime: newSlot.startTime + ":00",
                endTime: newSlot.endTime + ":00"
            });
            alert('Slot added successfully!');
            setNewSlot({ availableDate: '', startTime: '', endTime: '' });
            fetchSlots();
        } catch (err) {
            const errorMsg = err.response?.data || 'Failed to add slot';
            alert(errorMsg);
        }
    };

    const handleDeleteSlot = async (id) => {
        if (window.confirm("Are you sure you want to delete this slot?")) {
            try {
                await API.delete(`/availability/${id}`);
                alert('Slot deleted successfully!');
                fetchSlots();
            } catch (err) {
                alert('Failed to delete slot');
            }
        }
    };

    if (loading) return <div className="loading-spinner">Loading slots...</div>;

    return (
        <div className="manage-section">
            <div className="section-header">
                <h3>Manage Availability Slots</h3>
            </div>

            <form onSubmit={handleAddSlot} className="availability-form" style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div className="input-group">
                    <label>Date:</label>
                    <input 
                        type="date" 
                        required 
                        min={new Date().toISOString().split('T')[0]}
                        value={newSlot.availableDate}
                        onChange={(e) => setNewSlot({...newSlot, availableDate: e.target.value})}
                    />
                </div>
                <div className="input-group">
                    <label>Start Time:</label>
                    <input 
                        type="time" 
                        required 
                        value={newSlot.startTime}
                        onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                    />
                </div>
                <div className="input-group">
                    <label>End Time:</label>
                    <input 
                        type="time" 
                        required 
                        value={newSlot.endTime}
                        onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                    />
                </div>
                <button type="submit" className="add-btn" style={{ marginTop: '24px' }}>Add Slot</button>
            </form>

            <div className="availability-grid">
                {slots.length > 0 ? (
                    slots.map(slot => (
                        <div key={slot.id} className="availability-card">
                            <div className="card-header">
                                <span className="date-badge">{slot.availableDate}</span>
                                <span className={`status-pill ${slot.booked ? 'booked' : 'available'}`}>
                                    {slot.booked ? 'Booked' : 'Available'}
                                </span>
                            </div>
                            <div className="card-body">
                                <div className="time-range">
                                    <span className="time-block">Start: <b>{slot.startTime.substring(0, 5)}</b></span>
                                    <span className="time-block">End: <b>{slot.endTime.substring(0, 5)}</b></span>
                                </div>
                            </div>
                            <div className="card-footer">
                                {!slot.booked ? (
                                    <button className="delete-btn-modern" onClick={() => handleDeleteSlot(slot.id)}>Delete Slot</button>
                                ) : (
                                    <span className="text-muted">Cannot delete (Booked)</span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">No availability slots found.</div>
                )}
            </div>
        </div>
    );
};

export default DoctorAvailabilityManager;
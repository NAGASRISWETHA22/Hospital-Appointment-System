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
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            // setLoading(true); // Don't show global loading when just refreshing the list
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
        try {
            await API.post('/availability', {
                doctor: { id: user.id },
                availableDate: newSlot.availableDate,
                startTime: newSlot.startTime,
                endTime: newSlot.endTime,
                booked: false
            });
            alert('Slot added successfully!');
            setNewSlot({ availableDate: '', startTime: '', endTime: '' });
            fetchSlots();
        } catch (err) {
            alert('Failed to add slot');
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

            <form onSubmit={handleAddSlot} className="availability-form" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input 
                    type="date" 
                    required 
                    min={new Date().toISOString().split('T')[0]}
                    value={newSlot.availableDate}
                    onChange={(e) => setNewSlot({...newSlot, availableDate: e.target.value})}
                />
                <input 
                    type="time" 
                    required 
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                />
                <input 
                    type="time" 
                    required 
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                />
                <button type="submit" className="add-btn">Add Slot</button>
            </form>

            <div className="availability-grid">
                {slots.length > 0 ? (
                    slots.map(slot => (
                        <div key={slot.id} className="availability-card">
                            <div className="card-header">
                                <span className="date-badge">{slot.availableDate}</span>
                                <span className={`status-pill ${slot.booked || slot.isBooked ? 'booked' : 'available'}`}>
                                    {slot.booked || slot.isBooked ? 'Booked' : 'Available'}
                                </span>
                            </div>
                            <div className="card-body">
                                <div className="time-range">
                                    <span className="time-block">Start: <b>{slot.startTime}</b></span>
                                    <span className="time-block">End: <b>{slot.endTime}</b></span>
                                </div>
                            </div>
                            <div className="card-footer">
                                {!(slot.booked || slot.isBooked) ? (
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

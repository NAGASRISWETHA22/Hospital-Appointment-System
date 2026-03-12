import React, { useState, useEffect } from 'react';
import { getAllAppointments, adminCancelAppointment } from '../services/appointmentService';
import { getAllDoctors, registerDoctor, deleteUser } from '../services/userService';
import { getDashboardStats } from '../services/analyticsService';
import { getAllDepartments, createDepartment, deleteDepartment } from '../services/departmentService';

const AdminPanel = ({ mode }) => {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Modal state for Add Doctor
    const [showModal, setShowModal] = useState(false);
    const [newDoctor, setNewDoctor] = useState({
        name: '',
        email: '',
        password: '',
        specialization: '',
        role: 'DOCTOR',
        department: { id: '' }
    });

    // Modal state for Add Department
    const [showDeptModal, setShowDeptModal] = useState(false);
    const [newDept, setNewDept] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        fetchData();
    }, [mode]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (mode === 'analytics') {
                const [appRes, statsRes] = await Promise.all([
                    getAllAppointments(),
                    getDashboardStats()
                ]);
                setAppointments(appRes.data || []);
                setStats(statsRes.data || null);
            } else if (mode === 'all-appointments') {
                const res = await getAllAppointments();
                setAppointments(res.data || []);
            } else if (mode === 'manage-doctors') {
                const [docRes, deptRes] = await Promise.all([
                    getAllDoctors(),
                    getAllDepartments()
                ]);
                setDoctors(docRes.data || []);
                setDepartments(deptRes.data || []);
            } else if (mode === 'manage-departments') {
                const res = await getAllDepartments();
                setDepartments(res.data || []);
            }
        } catch (err) {
            console.error("Data fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Admin Power: Are you sure you want to delete this booking?")) {
            try {
                await adminCancelAppointment(id);
                alert("Deleted successfully!");
                fetchData(); 
            } catch (err) {
                alert("Action failed.");
            }
        }
    };

    // Form submit logic to add doctor
    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            await registerDoctor(newDoctor);
            alert("Doctor registered successfully!");
            setShowModal(false);
            setNewDoctor({ name: '', email: '', password: '', specialization: '', role: 'DOCTOR', department: { id: '' } });
            fetchData(); // List-a refresh panna
        } catch (err) {
            alert("Registration failed. Email might already exist.");
        }
    };

    const handleAddDept = async (e) => {
        e.preventDefault();
        try {
            await createDepartment(newDept);
            alert("Department added successfully!");
            setShowDeptModal(false);
            setNewDept({ name: '', description: '' });
            fetchData();
        } catch (err) {
            alert("Failed to add department.");
        }
    };

    const handleDeleteDept = async (id) => {
        if (window.confirm("Are you sure you want to delete this department?")) {
            try {
                await deleteDepartment(id);
                alert("Deleted successfully!");
                fetchData();
            } catch (err) {
                alert("Action failed.");
            }
        }
    };

    const handleDeleteDoctor = async (id) => {
        if (window.confirm("Are you sure you want to remove this doctor?")) {
            try {
                await deleteUser(id);
                alert("Doctor removed successfully!");
                fetchData();
            } catch (err) {
                alert("Action failed.");
            }
        }
    };

    if (loading) return <div className="loading-state">Loading Admin Data...</div>;

    return (
        <div className="admin-content-area">
            
            {/* --- 1. ANALYTICS VIEW --- */}
            {mode === 'analytics' && (
                <div className="analytics-dashboard">
                    <div className="analytics-grid">
                        <div className="stat-card">
                            <h4>Total Appointments</h4>
                            <p className="stat-value">{stats?.totalAppointments || 0}</p>
                        </div>
                        <div className="stat-card">
                            <h4>Total Revenue</h4>
                            <p className="stat-value">₹{stats?.totalRevenue || 0}</p>
                        </div>
                        <div className="stat-card">
                            <h4>Total Doctors</h4>
                            <p className="stat-value">{stats?.totalDoctors || 0}</p>
                        </div>
                        <div className="stat-card">
                            <h4>Total Patients</h4>
                            <p className="stat-value">{stats?.totalPatients || 0}</p>
                        </div>
                    </div>

                    <div className="report-sections" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
                        <div className="report-card">
                            <h4>Revenue per Department</h4>
                            <table className="mini-table">
                                <thead>
                                    <tr><th>Department</th><th>Revenue</th></tr>
                                </thead>
                                <tbody>
                                    {stats?.revenuePerDepartment?.map((row, idx) => (
                                        <tr key={idx}><td>{row.departmentName}</td><td>₹{row.revenue}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="report-card">
                            <h4>Appointments per Doctor</h4>
                            <table className="mini-table">
                                <thead>
                                    <tr><th>Doctor</th><th>Count</th></tr>
                                </thead>
                                <tbody>
                                    {stats?.appointmentsPerDoctor?.map((row, idx) => (
                                        <tr key={idx}><td>{row.doctorName}</td><td>{row.count}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* --- 2. DOCTOR MANAGEMENT VIEW --- */}
            {mode === 'manage-doctors' && (
                <div className="manage-section">
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3>Registered Doctors</h3>
                        <button className="add-btn" onClick={() => setShowModal(true)}>+ Add New Doctor</button>
                    </div>
                    
                    <table className="doctor-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Specialization</th>
                                <th>Department</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map(doc => (
                                <tr key={doc.id}>
                                    <td>{doc.name}</td>
                                    <td>{doc.specialization}</td>
                                    <td>{doc.department?.name || 'N/A'}</td>
                                    <td>{doc.email}</td>
                                    <td><button className="cancel-btn-small" onClick={() => handleDeleteDoctor(doc.id)}>Remove</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Add Doctor Modal */}
                    {showModal && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h3>Register New Doctor</h3>
                                <form onSubmit={handleAddDoctor}>
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input type="text" required value={newDoctor.name} 
                                            onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input type="email" required value={newDoctor.email} 
                                            onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input type="password" required value={newDoctor.password} 
                                            onChange={(e) => setNewDoctor({...newDoctor, password: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Department</label>
                                        <select 
                                            required 
                                            value={newDoctor.department.id} 
                                            onChange={(e) => setNewDoctor({...newDoctor, department: { id: e.target.value }})}
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Specialization</label>
                                        <input type="text" required value={newDoctor.specialization} placeholder="e.g. Cardiology"
                                            onChange={(e) => setNewDoctor({...newDoctor, specialization: e.target.value})} />
                                    </div>
                                    <div className="modal-actions">
                                        <button type="submit" className="confirm-btn-small">Add Doctor</button>
                                        <button type="button" className="cancel-btn-small" onClick={() => setShowModal(false)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- 3. DEPARTMENT MANAGEMENT VIEW --- */}
            {mode === 'manage-departments' && (
                <div className="manage-section">
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3>Hospital Departments</h3>
                        <button className="add-btn" onClick={() => setShowDeptModal(true)}>+ Add New Department</button>
                    </div>
                    
                    <table className="doctor-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map(dept => (
                                <tr key={dept.id}>
                                    <td>{dept.name}</td>
                                    <td>{dept.description}</td>
                                    <td>
                                        <button className="cancel-btn-small" onClick={() => handleDeleteDept(dept.id)}>
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Add Department Modal */}
                    {showDeptModal && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h3>Create New Department</h3>
                                <form onSubmit={handleAddDept}>
                                    <div className="form-group">
                                        <label>Department Name</label>
                                        <input type="text" required value={newDept.name} 
                                            onChange={(e) => setNewDept({...newDept, name: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea required value={newDept.description} 
                                            onChange={(e) => setNewDept({...newDept, description: e.target.value})} />
                                    </div>
                                    <div className="modal-actions">
                                        <button type="submit" className="confirm-btn-small">Add Department</button>
                                        <button type="button" className="cancel-btn-small" onClick={() => setShowDeptModal(false)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- 3. ALL APPOINTMENTS VIEW --- */}
            {mode === 'all-appointments' && (
                <div className="manage-section">
                    <h3>All Hospital Bookings</h3>
                    <table className="doctor-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(app => (
                                <tr key={app.id}>
                                    <td>{app.id}</td>
                                    <td>{app.patient?.name}</td>
                                    <td>{app.doctor?.name}</td>
                                    <td><span className={`status-pill ${app.status?.toLowerCase()}`}>{app.status}</span></td>
                                    <td>
                                        <button className="cancel-btn-small" onClick={() => handleCancel(app.id)}>
                                            Cancel Booking
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
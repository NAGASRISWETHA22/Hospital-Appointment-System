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
                        <div className="stat-card premium-stat">
                            <div className="stat-icon">📅</div>
                            <div className="stat-info">
                                <h4>Total Appointments</h4>
                                <p className="stat-value">{stats?.totalAppointments || 0}</p>
                            </div>
                        </div>
                        <div className="stat-card premium-stat">
                            <div className="stat-icon">💰</div>
                            <div className="stat-info">
                                <h4>Total Revenue</h4>
                                <p className="stat-value">₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
                            </div>
                        </div>
                        <div className="stat-card premium-stat">
                            <div className="stat-icon">🧑‍⚕️</div>
                            <div className="stat-info">
                                <h4>Total Doctors</h4>
                                <p className="stat-value">{stats?.totalDoctors || 0}</p>
                            </div>
                        </div>
                        <div className="stat-card premium-stat">
                            <div className="stat-icon">👤</div>
                            <div className="stat-info">
                                <h4>Total Patients</h4>
                                <p className="stat-value">{stats?.totalPatients || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="report-sections-modern">
                        <div className="report-card-premium">
                            <div className="rc-header">
                                <h4>Revenue per Department</h4>
                                <button className="refresh-btn-small" onClick={fetchData}>Export CSV</button>
                            </div>
                            <div className="rc-list">
                                {stats?.revenuePerDepartment?.map((row, idx) => (
                                    <div key={idx} className="rc-item">
                                        <div className="rc-item-info">
                                            <span>{row.departmentName}</span>
                                            <span className="rc-amount">₹{row.revenue.toLocaleString()}</span>
                                        </div>
                                        <div className="rc-progress-bg">
                                            <div className="rc-progress-bar" style={{ width: `${Math.min(100, (row.revenue / (stats.totalRevenue || 1)) * 100)}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="report-card-premium">
                            <div className="rc-header">
                                <h4>Appointments per Doctor</h4>
                            </div>
                            <div className="rc-list">
                                {stats?.appointmentsPerDoctor?.map((row, idx) => (
                                    <div key={idx} className="rc-item">
                                        <div className="rc-item-info">
                                            <span>Dr. {row.doctorName}</span>
                                            <span className="rc-count-pill">{row.appointmentCount} Bookings</span>
                                        </div>
                                        <div className="rc-progress-bg">
                                            <div className="rc-progress-bar accent" style={{ width: `${Math.min(100, (row.appointmentCount / (stats.totalAppointments || 1)) * 100)}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
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

                    <div className="doctor-grid">
                        {doctors.map(doc => (
                            <div key={doc.id} className="doctor-card">
                                <div className="doc-card-header">
                                    <h4 className="doc-name">{doc.name}</h4>
                                    <span className="doc-specialty">{doc.specialty || doc.specialization}</span>
                                </div>
                                <div className="doc-card-body">
                                    <p className="doc-dept">🏢 {doc.department?.name || 'Unassigned'}</p>
                                    <p className="doc-dept" style={{marginTop: '10px'}}>📧 {doc.email}</p>
                                </div>
                                <div className="doc-card-footer">
                                    <button className="delete-btn-modern" onClick={() => handleDeleteDoctor(doc.id)}>Remove Doctor</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Doctor Modal */}
                    {showModal && (
                        <div className="modal-overlay" onClick={() => setShowModal(false)}>
                            <div className="booking-modal premium-modal" onClick={e => e.stopPropagation()}>
                                <div className="pm-header">
                                    <h4>Register New Doctor</h4>
                                    <p className="pm-subtitle">Add a new medical professional to the system</p>
                                </div>
                                <form onSubmit={handleAddDoctor} className="booking-form">
                                    <div className="form-group modern-input-group">
                                        <label>Full Name</label>
                                        <input type="text" required value={newDoctor.name} 
                                            onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})} placeholder="Dr. First Last" />
                                    </div>
                                    <div className="form-group modern-input-group">
                                        <label>Email Address</label>
                                        <input type="email" required value={newDoctor.email} 
                                            onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})} placeholder="doctor@hospital.com" />
                                    </div>
                                    <div className="form-group modern-input-group">
                                        <label>Password</label>
                                        <input type="password" required value={newDoctor.password} 
                                            onChange={(e) => setNewDoctor({...newDoctor, password: e.target.value})} placeholder="••••••••" />
                                    </div>
                                    <div className="form-group modern-input-group">
                                        <label>Department</label>
                                        <select 
                                            required 
                                            value={newDoctor.department.id} 
                                            onChange={(e) => setNewDoctor({...newDoctor, department: { id: e.target.value }})}
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0', fontFamily: 'inherit' }}
                                        >
                                            <option value="">Select Department...</option>
                                            {departments.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group modern-input-group">
                                        <label>Specialization</label>
                                        <input type="text" required value={newDoctor.specialization} placeholder="e.g. Cardiology"
                                            onChange={(e) => setNewDoctor({...newDoctor, specialization: e.target.value})} />
                                    </div>
                                    <div className="modal-actions row-actions">
                                        <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button type="submit" className="confirm-btn">Register Doctor</button>
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
                    <div className="doctor-grid">
                        {departments.map(dept => (
                            <div key={dept.id} className="doctor-card">
                                <div className="doc-card-header">
                                    <h4 className="doc-name">{dept.name}</h4>
                                </div>
                                <div className="doc-card-body">
                                    <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>{dept.description}</p>
                                </div>
                                <div className="doc-card-footer">
                                    <button className="delete-btn-modern" onClick={() => handleDeleteDept(dept.id)}>
                                        Remove Department
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Department Modal */}
                    {showDeptModal && (
                        <div className="modal-overlay" onClick={() => setShowDeptModal(false)}>
                            <div className="booking-modal premium-modal" onClick={e => e.stopPropagation()}>
                                <div className="pm-header">
                                    <h4>Create New Department</h4>
                                    <p className="pm-subtitle">Add a new specialty wing to the hospital</p>
                                </div>
                                <form onSubmit={handleAddDept} className="booking-form">
                                    <div className="form-group modern-input-group">
                                        <label>Department Name</label>
                                        <input type="text" required value={newDept.name} placeholder="e.g. Neurology"
                                            onChange={(e) => setNewDept({...newDept, name: e.target.value})} />
                                    </div>
                                    <div className="form-group modern-input-group">
                                        <label>Description</label>
                                        <textarea required value={newDept.description} placeholder="Short description of department..."
                                            onChange={(e) => setNewDept({...newDept, description: e.target.value})} 
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0', fontFamily: 'inherit', resize: 'vertical' }}
                                        />
                                    </div>
                                    <div className="modal-actions row-actions">
                                        <button type="button" className="cancel-btn" onClick={() => setShowDeptModal(false)}>Cancel</button>
                                        <button type="submit" className="confirm-btn">Add Department</button>
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
                    <div className="availability-grid">
                        {appointments.map(app => (
                            <div key={app.id} className="availability-card">
                                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className="date-badge">Booking #{app.id}</span>
                                    <span className={`status-pill ${app.status?.toLowerCase()}`}>{app.status}</span>
                                </div>
                                <div className="card-body">
                                    <p className="doc-dept" style={{marginBottom: '8px'}}>🧑 <b>Patient:</b> {app.patient?.name}</p>
                                    <p className="doc-dept">🩺 <b>Doctor:</b> {app.doctor?.name}</p>
                                </div>
                                <div className="card-footer">
                                    <button className="delete-btn-modern" onClick={() => handleCancel(app.id)}>
                                        Cancel Booking (Admin Override)
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import DoctorList from '../components/DoctorList';
import AppointmentHistory from '../components/AppointmentHistory';
import DoctorSchedule from '../components/DoctorSchedule';
import AdminPanel from '../components/AdminPanel';
import DoctorAvailabilityManager from '../components/DoctorAvailabilityManager';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');

    if (!user) {
        return <div className="loading">Loading Dashboard...</div>;
    }

    // Role-a base panni sidebar menu items-a switch panrom
    const renderSidebarItems = () => {
        switch (user.role) {
            case 'ADMIN':
                return (
                    <>
                        <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>System Analytics</button>
                        <button className={activeTab === 'manage-doctors' ? 'active' : ''} onClick={() => setActiveTab('manage-doctors')}>Manage Doctors</button>
                        <button className={activeTab === 'manage-departments' ? 'active' : ''} onClick={() => setActiveTab('manage-departments')}>Manage Departments</button>
                        <button className={activeTab === 'all-appointments' ? 'active' : ''} onClick={() => setActiveTab('all-appointments')}>All Bookings</button>
                    </>
                );
            case 'DOCTOR':
                return (
                    <>
                        <button className={activeTab === 'my-schedule' ? 'active' : ''} onClick={() => setActiveTab('my-schedule')}>My Schedule</button>
                        <button className={activeTab === 'availability' ? 'active' : ''} onClick={() => setActiveTab('availability')}>Manage Slots</button>
                    </>
                );
            case 'PATIENT':
                return (
                    <>
                        <button className={activeTab === 'book-doctor' ? 'active' : ''} onClick={() => setActiveTab('book-doctor')}>Book Doctor</button>
                        <button className={activeTab === 'my-history' ? 'active' : ''} onClick={() => setActiveTab('my-history')}>My History</button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar Section */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <h2>CareHub</h2>
                </div>
                <nav className="sidebar-nav">
                    <button 
                        className={activeTab === 'overview' ? 'active' : ''} 
                        onClick={() => setActiveTab('overview')}
                    >
                        Dashboard Home
                    </button>
                    {renderSidebarItems()}
                </nav>
                <button className="logout-btn" onClick={logout}>Logout</button>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <header className="content-header">
                    <div className="user-welcome">
                        <h1>Welcome, {user.name}!</h1>
                        <span className="role-badge">{user.role}</span>
                    </div>
                </header>

                <div className="content-body">
                    {/* 1. ADMIN VIEWS */}
                    {user.role === 'ADMIN' && (
                        <>
                            {activeTab === 'overview' || activeTab === 'analytics' ? <AdminPanel mode="analytics" /> : null}
                            {activeTab === 'manage-doctors' && <AdminPanel mode="manage-doctors" />}
                            {activeTab === 'manage-departments' && <AdminPanel mode="manage-departments" />}
                            {activeTab === 'all-appointments' && <AdminPanel mode="all-appointments" />}
                        </>
                    )}

                    {/* 2. DOCTOR VIEWS */}
                    {user.role === 'DOCTOR' && (
                        <>
                            {(activeTab === 'overview' || activeTab === 'my-schedule') && (
                                <DoctorSchedule doctorId={user.id} />
                            )}
                            {activeTab === 'availability' && <DoctorAvailabilityManager />}
                        </>
                    )}

                    {/* 3. PATIENT VIEWS */}
                    {user.role === 'PATIENT' && (
                        <>
                            {activeTab === 'book-doctor' && <DoctorList />}
                            {(activeTab === 'overview' || activeTab === 'my-history') && (
                                <AppointmentHistory patientId={user.id} />
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
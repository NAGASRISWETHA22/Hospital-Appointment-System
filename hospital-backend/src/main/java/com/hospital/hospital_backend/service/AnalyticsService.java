package com.hospital.hospital_backend.service;

import java.util.List;
import java.util.Map;

public interface AnalyticsService {
    Map<String, Object> getAdminDashboardStats();
    List<Map<String, Object>> getAppointmentsPerDoctor();
    // Revenue logic can simply assume a fixed cost per appointment for now
    List<Map<String, Object>> getRevenuePerDepartment();
}

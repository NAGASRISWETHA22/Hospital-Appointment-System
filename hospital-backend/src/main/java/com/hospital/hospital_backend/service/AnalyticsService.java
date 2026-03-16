package com.hospital.hospital_backend.service;

import com.hospital.hospital_backend.dto.response.DashboardStatsResponse;

public interface AnalyticsService {
    DashboardStatsResponse getDashboardStats();
    String exportAppointmentsToCSV();
}

package com.hospital.hospital_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalAppointments;
    private double totalRevenue;
    private long totalDoctors;
    private long totalPatients;
    private List<DepartmentRevenue> revenuePerDepartment;
    private List<DoctorAppointmentCount> appointmentsPerDoctor;
}

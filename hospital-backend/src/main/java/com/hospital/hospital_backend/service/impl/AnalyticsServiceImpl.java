package com.hospital.hospital_backend.service.impl;

import com.hospital.hospital_backend.entity.Appointment;
import com.hospital.hospital_backend.repository.AppointmentRepository;
import com.hospital.hospital_backend.repository.DepartmentRepository;
import com.hospital.hospital_backend.repository.UserRepository;
import com.hospital.hospital_backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    public Map<String, Object> getAdminDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalAppointments = appointmentRepository.count();
        long totalDoctors = userRepository.findByRole(com.hospital.hospital_backend.enums.Role.DOCTOR).size();
        long totalPatients = userRepository.findByRole(com.hospital.hospital_backend.enums.Role.PATIENT).size();
        stats.put("totalAppointments", totalAppointments);
        stats.put("totalDoctors", totalDoctors);
        stats.put("totalPatients", totalPatients);
        // Assuming Rs. 500 per appointment
        stats.put("totalRevenue", totalAppointments * 500);
        return stats;
    }

    @Override
    public List<Map<String, Object>> getAppointmentsPerDoctor() {
        List<Object[]> results = appointmentRepository.countAppointmentsPerDoctor();
        return results.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("doctorName", row[0]);
            map.put("appointmentCount", row[1]);
            return map;
        }).collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getRevenuePerDepartment() {
        // Find all appointments, group by doctor -> department
        List<Appointment> allAppointments = appointmentRepository.findAll();
        Map<String, Long> countPerDept = allAppointments.stream()
                .filter(a -> a.getDoctor().getDepartment() != null)
                .collect(Collectors.groupingBy(
                        a -> a.getDoctor().getDepartment().getName(),
                        Collectors.counting()
                ));

        return countPerDept.entrySet().stream().map(entry -> {
            Map<String, Object> map = new HashMap<>();
            map.put("departmentName", entry.getKey());
            map.put("revenue", entry.getValue() * 500); // 500 per appointment
            return map;
        }).collect(Collectors.toList());
    }
}

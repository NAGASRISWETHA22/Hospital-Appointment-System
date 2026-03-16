package com.hospital.hospital_backend.service;

import com.hospital.hospital_backend.dto.response.DashboardStatsResponse;
import com.hospital.hospital_backend.dto.response.DepartmentRevenue;
import com.hospital.hospital_backend.dto.response.DoctorAppointmentCount;
import com.hospital.hospital_backend.entity.Appointment;
import com.hospital.hospital_backend.enums.AppointmentStatus;
import com.hospital.hospital_backend.enums.Role;
import com.hospital.hospital_backend.repository.AppointmentRepository;
import com.hospital.hospital_backend.repository.UserRepository;
import com.hospital.hospital_backend.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    private static final double CONSULTATION_FEE = 500.0;

    public DashboardStatsResponse getDashboardStats() {
        long totalAppointments = appointmentRepository.count();
        long totalDoctors = userRepository.countByRole(Role.DOCTOR);
        long totalPatients = userRepository.countByRole(Role.PATIENT);
        
        long completedAppointments = appointmentRepository.countByStatus(AppointmentStatus.COMPLETED);
        double totalRevenue = completedAppointments * CONSULTATION_FEE;

        List<DepartmentRevenue> revenuePerDepartment = departmentRepository.findAll().stream()
            .map(dept -> {
                long completedInDept = appointmentRepository.findAll().stream()
                    .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED && 
                                a.getDoctor().getDepartment() != null && 
                                a.getDoctor().getDepartment().getId().equals(dept.getId()))
                    .count();
                return new DepartmentRevenue(dept.getName(), completedInDept * CONSULTATION_FEE);
            })
            .collect(Collectors.toList());

        List<DoctorAppointmentCount> appointmentsPerDoctor = userRepository.findByRole(Role.DOCTOR).stream()
            .map(doctor -> {
                long count = appointmentRepository.countByDoctor_Id(doctor.getId());
                return new DoctorAppointmentCount(doctor.getName(), count);
            })
            .collect(Collectors.toList());

        return DashboardStatsResponse.builder()
                .totalAppointments(totalAppointments)
                .totalRevenue(totalRevenue)
                .totalDoctors(totalDoctors)
                .totalPatients(totalPatients)
                .revenuePerDepartment(revenuePerDepartment)
                .appointmentsPerDoctor(appointmentsPerDoctor)
                .build();
    }

    public String exportAppointmentsToCSV() {
        List<Appointment> appointments = appointmentRepository.findAll();
        StringBuilder csv = new StringBuilder("ID,Patient,Doctor,Date,Time,Status\n");
        for (Appointment a : appointments) {
            csv.append(a.getId()).append(",")
               .append(a.getPatient().getName()).append(",")
               .append(a.getDoctor().getName()).append(",")
               .append(a.getAppointmentDate()).append(",")
               .append(a.getStartTime()).append(",")
               .append(a.getStatus()).append("\n");
        }
        return csv.toString();
    }
}

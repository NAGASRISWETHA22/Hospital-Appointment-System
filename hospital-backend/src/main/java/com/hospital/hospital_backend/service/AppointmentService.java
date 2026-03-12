package com.hospital.hospital_backend.service;

import java.util.List;

import com.hospital.hospital_backend.dto.AppointmentRequest;
import com.hospital.hospital_backend.entity.Appointment;
import com.hospital.hospital_backend.enums.AppointmentStatus;
public interface AppointmentService {
    Appointment bookAppointment(AppointmentRequest request);
    List<Appointment> getDoctorSchedule(Long doctorId);
    List<Appointment> getAllAppointments(); // Add this
    Appointment updateStatus(Long id, AppointmentStatus status); // Add this
    void deleteAppointment(Long id); // Add this
    List<Appointment> getPatientHistory(Long patientId);
}
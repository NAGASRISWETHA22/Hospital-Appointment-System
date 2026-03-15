package com.hospital.hospital_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hospital.hospital_backend.dto.request.AppointmentRequest;
import com.hospital.hospital_backend.dto.response.AppointmentResponse;
import com.hospital.hospital_backend.entity.Appointment;
import com.hospital.hospital_backend.enums.AppointmentStatus;
import com.hospital.hospital_backend.service.AppointmentService;
import com.hospital.hospital_backend.service.impl.AppointmentServiceImpl;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
// @CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final AppointmentServiceImpl appointmentServiceImpl;

    @PostMapping("/book")
    public ResponseEntity<AppointmentResponse> book(@RequestBody AppointmentRequest request) {
        Appointment appointment = appointmentService.bookAppointment(request);
        return ResponseEntity.ok(appointmentServiceImpl.convertToResponse(appointment));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentResponse>> getPatientHistory(@PathVariable Long patientId) {
        List<AppointmentResponse> history = appointmentService.getPatientHistory(patientId).stream()
                .map(appointmentServiceImpl::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(history);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentResponse>> getSchedule(@PathVariable Long doctorId) {
        List<AppointmentResponse> schedule = appointmentService.getDoctorSchedule(doctorId).stream()
                .map(appointmentServiceImpl::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(schedule);
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<AppointmentResponse> updateStatus(@PathVariable Long id,
            @RequestParam AppointmentStatus status) {
        Appointment appointment = appointmentService.updateStatus(id, status);
        return ResponseEntity.ok(appointmentServiceImpl.convertToResponse(appointment));
    }

    @GetMapping("/all")
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments() {
        List<AppointmentResponse> appointments = appointmentService.getAllAppointments().stream()
                .map(appointmentServiceImpl::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(appointments);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok("Deleted successfully");
    }
}
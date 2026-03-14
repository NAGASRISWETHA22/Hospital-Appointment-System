package com.hospital.hospital_backend.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.hospital_backend.dto.AppointmentRequest;
import com.hospital.hospital_backend.entity.Appointment;
import com.hospital.hospital_backend.entity.DoctorAvailability;
import com.hospital.hospital_backend.entity.User;
import com.hospital.hospital_backend.enums.AppointmentStatus;
import com.hospital.hospital_backend.repository.AppointmentRepository;
import com.hospital.hospital_backend.repository.DoctorAvailabilityRepository;
import com.hospital.hospital_backend.repository.UserRepository;
import com.hospital.hospital_backend.service.AppointmentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorAvailabilityRepository availabilityRepository;

    @Override
    @Transactional
    public Appointment bookAppointment(AppointmentRequest request) {
        if (request.getDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Appointments must be scheduled for a future date!");
        }

        User patient = userRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Check if the doctor is available for the given date and start time
        Optional<DoctorAvailability> slotOpt = availabilityRepository
                .findByDoctorAndAvailableDateAndStartTime(doctor, request.getDate(), request.getStartTime());

        if (slotOpt.isEmpty() || slotOpt.get().isBooked()) {
            throw new RuntimeException("Doctor is not available for the selected time slot!");
        }

        // Mark slot as booked - Sync both columns
        DoctorAvailability slot = slotOpt.get();
        slot.setBooked(true);
        slot.setBookedLegacy(true);
        availabilityRepository.save(slot);

        boolean isPatientBusy = appointmentRepository.existsByPatient_IdAndAppointmentDateAndStartTime(
                request.getPatientId(), request.getDate(), request.getStartTime());

        if (isPatientBusy) {
            throw new RuntimeException("You already have an appointment scheduled at this time!");
        }

        // 5. Save Logic
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.getDate());
        appointment.setStartTime(request.getStartTime());
        appointment.setEndTime(request.getEndTime());
        appointment.setStatus(AppointmentStatus.PENDING); // Default status PENDING

        return appointmentRepository.save(appointment);
    }

    @Override
    public List<Appointment> getDoctorSchedule(Long doctorId) {
        return appointmentRepository.findByDoctor_Id(doctorId);
    }

    @Override
    public List<Appointment> getPatientHistory(Long patientId) {
        return appointmentRepository.findByPatient_Id(patientId);
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    @Transactional
    public Appointment updateStatus(Long id, AppointmentStatus status) {
        Appointment app = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // If cancelling OR rejecting, free up the doctor's slot
        if (status == AppointmentStatus.CANCELLED || status == AppointmentStatus.REJECTED) {
            Optional<DoctorAvailability> slotOpt = availabilityRepository
                    .findByDoctorAndAvailableDateAndStartTime(app.getDoctor(), app.getAppointmentDate(), app.getStartTime());
            slotOpt.ifPresent(slot -> {
                slot.setBooked(false);
                slot.setBookedLegacy(false);
                availabilityRepository.save(slot);
            });
        }

        app.setStatus(status);
        return appointmentRepository.save(app);
    }

    @Override
    @Transactional
    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete: Appointment not found");
        }
        appointmentRepository.deleteById(id);
    }
}
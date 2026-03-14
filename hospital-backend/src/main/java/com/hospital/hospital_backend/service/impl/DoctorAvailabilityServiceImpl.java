package com.hospital.hospital_backend.service.impl;

import com.hospital.hospital_backend.dto.DoctorAvailabilityRequest;
import com.hospital.hospital_backend.entity.DoctorAvailability;
import com.hospital.hospital_backend.entity.User;
import com.hospital.hospital_backend.repository.DoctorAvailabilityRepository;
import com.hospital.hospital_backend.repository.UserRepository;
import com.hospital.hospital_backend.service.DoctorAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorAvailabilityServiceImpl implements DoctorAvailabilityService {

    private final DoctorAvailabilityRepository availabilityRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public DoctorAvailability addAvailability(DoctorAvailabilityRequest request) {
        if (request.getDoctorId() == null) {
            throw new RuntimeException("Doctor ID is required to add a slot!");
        }

        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + request.getDoctorId()));

        if (request.getAvailableDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Cannot add slots for past dates!");
        }

        boolean exists = availabilityRepository.existsByDoctor_IdAndAvailableDateAndStartTime(
                doctor.getId(), request.getAvailableDate(), request.getStartTime());

        if (exists) {
            throw new RuntimeException("This time slot already exists for the doctor!");
        }

        DoctorAvailability availability = new DoctorAvailability();
        availability.setDoctor(doctor);
        availability.setAvailableDate(request.getAvailableDate());
        availability.setStartTime(request.getStartTime());
        availability.setEndTime(request.getEndTime());
        availability.setBooked(false);

        return availabilityRepository.save(availability);
    }

    @Override
    public List<DoctorAvailability> getAvailabilityByDoctorAndDate(Long doctorId, LocalDate date) {
        return availabilityRepository.findByDoctor_IdAndAvailableDateAndBookedFalse(doctorId, date);
    }

    @Override
    public List<DoctorAvailability> getUpcomingAvailabilityByDoctor(Long doctorId) {
        return availabilityRepository.findByDoctor_IdOrderByAvailableDateDesc(doctorId);
    }

    @Override
    @Transactional
    public void deleteAvailability(Long id) {
        availabilityRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void markAsBooked(Long id) {
        DoctorAvailability availability = availabilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Availability not found"));
        availability.setBooked(true);
        availabilityRepository.save(availability);
    }

    @Override
    public List<User> getDoctorsAvailableOnDate(LocalDate date) {
        // Get all unbooked slots on the given date, then extract distinct doctors
        List<DoctorAvailability> slots = availabilityRepository.findByAvailableDateAndBookedFalse(date);
        return slots.stream()
                .map(DoctorAvailability::getDoctor)
                .distinct()
                .collect(Collectors.toList());
    }
}
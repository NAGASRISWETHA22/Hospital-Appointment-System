package com.hospital.hospital_backend.service.impl;

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

@Service
@RequiredArgsConstructor
public class DoctorAvailabilityServiceImpl implements DoctorAvailabilityService {

    private final DoctorAvailabilityRepository availabilityRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public DoctorAvailability addAvailability(DoctorAvailability availability) {
        // 1. Validate if Doctor exists (This was missing in your code)
        if (availability.getDoctor() == null || availability.getDoctor().getId() == null) {
            throw new RuntimeException("Doctor ID is required to add a slot!");
        }

        User doctor = userRepository.findById(availability.getDoctor().getId())
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + availability.getDoctor().getId()));

        // 2. Prevent past date slots
        if (availability.getAvailableDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Cannot add slots for past dates!");
        }

        // 3. Prevent duplicate slots (Overlap check)
        boolean exists = availabilityRepository.existsByDoctor_IdAndAvailableDateAndStartTime(
                doctor.getId(), availability.getAvailableDate(), availability.getStartTime());
        
        if (exists) {
            throw new RuntimeException("This time slot already exists for the doctor!");
        }

        // Set the full doctor object and save
        availability.setDoctor(doctor);
        availability.setBooked(false); // New slots are always free
        return availabilityRepository.save(availability);
    }

    @Override
    public List<DoctorAvailability> getAvailabilityByDoctorAndDate(Long doctorId, LocalDate date) {
        // Only show slots that are NOT booked for the patient to see
        return availabilityRepository.findByDoctor_IdAndAvailableDateAndIsBookedFalse(doctorId, date);
    }

    @Override
    public List<DoctorAvailability> getUpcomingAvailabilityByDoctor(Long doctorId) {
        // Doctor dashboard sorted by date
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
}
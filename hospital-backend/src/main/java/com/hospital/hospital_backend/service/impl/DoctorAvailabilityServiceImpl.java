package com.hospital.hospital_backend.service.impl;

import com.hospital.hospital_backend.entity.DoctorAvailability;
import com.hospital.hospital_backend.repository.DoctorAvailabilityRepository;
import com.hospital.hospital_backend.service.DoctorAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorAvailabilityServiceImpl implements DoctorAvailabilityService {

    private final DoctorAvailabilityRepository availabilityRepository;

    @Override
    public DoctorAvailability addAvailability(DoctorAvailability availability) {
        return availabilityRepository.save(availability);
    }

    @Override
    public List<DoctorAvailability> getAvailabilityByDoctorAndDate(Long doctorId, LocalDate date) {
        return availabilityRepository.findByDoctor_IdAndAvailableDate(doctorId, date);
    }

    @Override
    public List<DoctorAvailability> getUpcomingAvailabilityByDoctor(Long doctorId) {
        // Return all slots for the manager, but maybe sorted by date
        return availabilityRepository.findByDoctor_IdOrderByAvailableDateDesc(doctorId);
    }

    @Override
    public void deleteAvailability(Long id) {
        availabilityRepository.deleteById(id);
    }

    @Override
    public void markAsBooked(Long id) {
        DoctorAvailability availability = availabilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Availability not found"));
        availability.setBooked(true);
        availabilityRepository.save(availability);
    }
}

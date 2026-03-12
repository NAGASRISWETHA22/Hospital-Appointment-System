package com.hospital.hospital_backend.service;

import com.hospital.hospital_backend.entity.DoctorAvailability;

import java.time.LocalDate;
import java.util.List;

public interface DoctorAvailabilityService {
    DoctorAvailability addAvailability(DoctorAvailability availability);
    List<DoctorAvailability> getAvailabilityByDoctorAndDate(Long doctorId, LocalDate date);
    List<DoctorAvailability> getUpcomingAvailabilityByDoctor(Long doctorId);
    void deleteAvailability(Long id);
    void markAsBooked(Long id);
}

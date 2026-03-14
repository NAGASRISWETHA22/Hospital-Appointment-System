package com.hospital.hospital_backend.service;

import com.hospital.hospital_backend.dto.DoctorAvailabilityRequest;
import com.hospital.hospital_backend.entity.DoctorAvailability;
import com.hospital.hospital_backend.entity.User;

import java.time.LocalDate;
import java.util.List;

public interface DoctorAvailabilityService {
    DoctorAvailability addAvailability(DoctorAvailabilityRequest request);
    List<DoctorAvailability> getAvailabilityByDoctorAndDate(Long doctorId, LocalDate date);
    List<DoctorAvailability> getUpcomingAvailabilityByDoctor(Long doctorId);
    void deleteAvailability(Long id);
    void markAsBooked(Long id);
    List<User> getDoctorsAvailableOnDate(LocalDate date);
}

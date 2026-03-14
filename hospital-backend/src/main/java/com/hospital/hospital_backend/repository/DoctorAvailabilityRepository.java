package com.hospital.hospital_backend.repository;

import com.hospital.hospital_backend.entity.DoctorAvailability;
import com.hospital.hospital_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {

    // For Doctor Dashboard
    List<DoctorAvailability> findByDoctor_IdOrderByAvailableDateDesc(Long doctorId);

    // For Patient Booking (Hide booked slots)
    List<DoctorAvailability> findByDoctor_IdAndAvailableDateAndIsBookedFalse(Long doctorId, LocalDate date);

    // Logic checks
    boolean existsByDoctor_IdAndAvailableDateAndStartTime(Long doctorId, LocalDate date, LocalTime startTime);

    Optional<DoctorAvailability> findByDoctorAndAvailableDateAndStartTime(User doctor, LocalDate availableDate,
            LocalTime startTime);
}
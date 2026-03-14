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

    List<DoctorAvailability> findByDoctor_IdOrderByAvailableDateDesc(Long doctorId);

    // FIXED: Changed 'IsBookedFalse' to 'BookedFalse' to match the entity field name 'booked'
    List<DoctorAvailability> findByDoctor_IdAndAvailableDateAndBookedFalse(Long doctorId, LocalDate date);

    boolean existsByDoctor_IdAndAvailableDateAndStartTime(Long doctorId, LocalDate date, LocalTime startTime);

    Optional<DoctorAvailability> findByDoctorAndAvailableDateAndStartTime(User doctor, LocalDate availableDate, LocalTime startTime);
}
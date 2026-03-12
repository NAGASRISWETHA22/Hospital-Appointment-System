package com.hospital.hospital_backend.repository;

import com.hospital.hospital_backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

        // 1. Doctor-oda schedule-a edukka
        List<Appointment> findByDoctor_Id(Long doctorId);

        // 2. Patient-oda appointment history-a edukka
        List<Appointment> findByPatient_Id(Long patientId);

        // 3. Overlap Check: Doctor busy-ah nu paaka (Time overlap logic)
        @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.doctor.id = :docId " +
                        "AND a.appointmentDate = :date " +
                        "AND a.status != 'CANCELLED' " +
                        "AND ((a.startTime < :end AND a.endTime > :start))")
        boolean existsOverlapping(
                        @Param("docId") Long docId,
                        @Param("date") LocalDate date,
                        @Param("start") LocalTime start,
                        @Param("end") LocalTime end);

        // 4. Patient Same Time Validation: Patient same time-la vera appointment
        // vechirukara?
        boolean existsByPatient_IdAndAppointmentDateAndStartTime(Long patientId, LocalDate date, LocalTime startTime);

        // 5. Reports: Total appointments per doctor (Admin Dashboard-kaga)
        @Query("SELECT a.doctor.name, COUNT(a) FROM Appointment a GROUP BY a.doctor.id")
        List<Object[]> countAppointmentsPerDoctor();
}
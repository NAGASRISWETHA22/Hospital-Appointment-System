package com.hospital.hospital_backend.entity;

import com.hospital.hospital_backend.enums.AppointmentStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "appointments")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;

    @Column(nullable = false)
    private LocalDate appointmentDate; // This matches request.getDate()

    @Column(nullable = false)
    private LocalTime startTime; // This matches request.getStartTime()

    @Column(nullable = false)
    private LocalTime endTime; // This matches request.getEndTime()

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status; // PENDING, BOOKED, CONFIRMED, CANCELLED, COMPLETED
}
package com.hospital.hospital_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "doctor_availability")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class DoctorAvailability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;

    @Column(nullable = false)
    private LocalDate availableDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    // The DB schema currently has BOTH 'booked' and 'is_booked' columns, and
    // neither has a DB default.
    // To prevent MySQL from rejecting inserts, we map both and ensure both are
    // populated.
    @Column(name = "is_booked", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean booked = false;

    // Renamed to 'bookedLegacy' to avoid Lombok generating duplicate 'setBooked'
    // and 'isBooked' methods!
    @Column(name = "booked", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean bookedLegacy = false;
}

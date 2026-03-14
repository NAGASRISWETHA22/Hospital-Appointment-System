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

    // CRITICAL FIX: The DB has BOTH 'is_booked' and 'booked' columns.
    // Previously mapped to 'is_booked', but MySQL rejected inserts because
    // the orphaned 'booked' column had no DEFAULT.
    // Now mapping to 'booked' directly. ddl-auto=update will add DEFAULT 0.
    @Column(name = "booked", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean booked = false;

}

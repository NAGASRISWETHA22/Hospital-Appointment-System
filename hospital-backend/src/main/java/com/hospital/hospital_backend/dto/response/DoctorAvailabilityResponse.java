package com.hospital.hospital_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorAvailabilityResponse {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private LocalDate availableDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean booked;
}

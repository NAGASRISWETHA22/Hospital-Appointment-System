package com.hospital.hospital_backend.controller;

import com.hospital.hospital_backend.entity.DoctorAvailability;
import com.hospital.hospital_backend.service.DoctorAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class DoctorAvailabilityController {

    private final DoctorAvailabilityService availabilityService;

    @PostMapping
    public ResponseEntity<DoctorAvailability> addAvailability(@RequestBody DoctorAvailability availability) {
        return ResponseEntity.ok(availabilityService.addAvailability(availability));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<DoctorAvailability>> getUpcomingAvailability(@PathVariable Long doctorId) {
        return ResponseEntity.ok(availabilityService.getUpcomingAvailabilityByDoctor(doctorId));
    }

    @GetMapping("/doctor/{doctorId}/date")
    public ResponseEntity<List<DoctorAvailability>> getAvailabilityByDate(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(availabilityService.getAvailabilityByDoctorAndDate(doctorId, date));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable Long id) {
        availabilityService.deleteAvailability(id);
        return ResponseEntity.ok().build();
    }
}

package com.hospital.hospital_backend.controller;

import com.hospital.hospital_backend.dto.request.DoctorAvailabilityRequest;
import com.hospital.hospital_backend.dto.response.DoctorAvailabilityResponse;
import com.hospital.hospital_backend.entity.DoctorAvailability;
import com.hospital.hospital_backend.entity.User;
import com.hospital.hospital_backend.service.DoctorAvailabilityService;
import com.hospital.hospital_backend.service.impl.DoctorAvailabilityServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class DoctorAvailabilityController {

    private final DoctorAvailabilityService availabilityService;
    private final DoctorAvailabilityServiceImpl availabilityServiceImpl;

    @PostMapping
    public ResponseEntity<?> addAvailability(@RequestBody DoctorAvailabilityRequest request) {
        try {
            DoctorAvailability availability = availabilityService.addAvailability(request);
            return ResponseEntity.ok(availabilityServiceImpl.convertToResponse(availability));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<DoctorAvailabilityResponse>> getUpcomingAvailability(@PathVariable Long doctorId) {
        List<DoctorAvailabilityResponse> responses = availabilityService.getUpcomingAvailabilityByDoctor(doctorId).stream()
                .map(availabilityServiceImpl::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/doctor/{doctorId}/date")
    public ResponseEntity<List<DoctorAvailability>> getAvailabilityByDate(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(availabilityService.getAvailabilityByDoctorAndDate(doctorId, date));
    }

    // Returns distinct doctors who have at least one unbooked slot on the given date
    @GetMapping("/available-on")
    public ResponseEntity<List<User>> getDoctorsAvailableOnDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(availabilityService.getDoctorsAvailableOnDate(date));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable Long id) {
        availabilityService.deleteAvailability(id);
        return ResponseEntity.ok().build();
    }
}
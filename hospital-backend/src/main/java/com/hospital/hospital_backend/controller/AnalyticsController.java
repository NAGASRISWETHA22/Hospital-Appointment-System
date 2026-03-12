package com.hospital.hospital_backend.controller;

import com.hospital.hospital_backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getAdminDashboardStats());
    }

    @GetMapping("/appointments-per-doctor")
    public ResponseEntity<List<Map<String, Object>>> getAppointmentsPerDoctor() {
        return ResponseEntity.ok(analyticsService.getAppointmentsPerDoctor());
    }

    @GetMapping("/revenue-per-department")
    public ResponseEntity<List<Map<String, Object>>> getRevenuePerDepartment() {
        return ResponseEntity.ok(analyticsService.getRevenuePerDepartment());
    }
}

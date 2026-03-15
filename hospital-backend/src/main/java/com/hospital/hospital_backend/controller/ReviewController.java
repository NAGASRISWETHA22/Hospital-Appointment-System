package com.hospital.hospital_backend.controller;

import com.hospital.hospital_backend.dto.request.ReviewRequest;
import com.hospital.hospital_backend.dto.response.ReviewResponse;
import com.hospital.hospital_backend.entity.Review;
import com.hospital.hospital_backend.service.ReviewService;
import com.hospital.hospital_backend.service.impl.ReviewServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
// @CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewServiceImpl reviewServiceImpl;

    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(@RequestBody ReviewRequest request) {
        Review review = reviewService.addReview(request);
        return ResponseEntity.ok(reviewServiceImpl.convertToResponse(review));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByDoctor(@PathVariable Long doctorId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByDoctor(doctorId).stream()
                .map(reviewServiceImpl::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok().build();
    }
}

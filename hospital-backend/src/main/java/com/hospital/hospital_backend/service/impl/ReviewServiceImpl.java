package com.hospital.hospital_backend.service.impl;

import com.hospital.hospital_backend.dto.request.ReviewRequest;
import com.hospital.hospital_backend.dto.response.ReviewResponse;
import com.hospital.hospital_backend.entity.Review;
import com.hospital.hospital_backend.entity.User;
import com.hospital.hospital_backend.repository.ReviewRepository;
import com.hospital.hospital_backend.repository.UserRepository;
import com.hospital.hospital_backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public ReviewResponse convertToResponse(Review review) {
        if (review == null) return null;
        return ReviewResponse.builder()
                .id(review.getId())
                .doctorId(review.getDoctor().getId())
                .doctorName(review.getDoctor().getName())
                .patientId(review.getPatient().getId())
                .patientName(review.getPatient().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .reviewDate(review.getReviewDate())
                .build();
    }
    @Override
    public Review addReview(ReviewRequest request) {
        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        User patient = userRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Review review = new Review();
        review.setDoctor(doctor);
        review.setPatient(patient);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setReviewDate(LocalDateTime.now());

        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviewsByDoctor(Long doctorId) {
        return reviewRepository.findByDoctorId(doctorId);
    }

    @Override
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}

package com.hospital.hospital_backend.service.impl;

import com.hospital.hospital_backend.entity.Review;
import com.hospital.hospital_backend.repository.ReviewRepository;
import com.hospital.hospital_backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    @Override
    public Review addReview(Review review) {
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

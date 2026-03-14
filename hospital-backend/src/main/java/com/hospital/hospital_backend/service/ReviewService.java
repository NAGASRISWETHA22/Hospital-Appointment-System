package com.hospital.hospital_backend.service;

import com.hospital.hospital_backend.dto.ReviewRequest;
import com.hospital.hospital_backend.entity.Review;
import java.util.List;

public interface ReviewService {
    Review addReview(ReviewRequest request);
    List<Review> getReviewsByDoctor(Long doctorId);
    void deleteReview(Long id);
}

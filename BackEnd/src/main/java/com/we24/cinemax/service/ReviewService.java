package com.we24.cinemax.service;

import com.we24.cinemax.model.ReviewRequest;
import com.we24.cinemax.model.ReviewResponse;

import java.util.List;
import java.util.Optional;

public interface ReviewService {
    ReviewResponse addReview(ReviewRequest request, String userEmail);
    List<ReviewResponse> getReviewsByMovie(Long movieId);
    ReviewResponse updateReview(Long id, ReviewRequest request, String userEmail);
    void deleteReview(Long id, String userEmail);
    Optional<ReviewResponse> getMyReviewForMovie(Long movieId, String userEmail);
}

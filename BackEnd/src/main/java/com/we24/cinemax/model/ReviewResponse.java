package com.we24.cinemax.model;

import com.we24.cinemax.entity.Review;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {
    private Long id;
    private Long movieId;
    private String movieName;
    private String userName;
    private Integer rating;
    private String reviewText;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ReviewResponse fromEntity(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .movieId(review.getMovie().getId())
                .movieName(review.getMovie().getMovieName())
                .userName(review.getUser() != null ? review.getUser().getFullName() : "Anonymous")
                .rating(review.getRating())
                .reviewText(review.getReviewText())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}

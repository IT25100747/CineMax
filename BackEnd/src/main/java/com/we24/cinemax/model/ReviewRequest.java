package com.we24.cinemax.model;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long movieId;
    private Long bookingId; // optional
    private Integer rating; // 1–5
    private String reviewText;
}

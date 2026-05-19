package com.we24.cinemax.controller;

import com.we24.cinemax.model.ReviewRequest;
import com.we24.cinemax.model.ReviewResponse;
import com.we24.cinemax.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /** Public — anyone can read reviews for a movie */
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(reviewService.getReviewsByMovie(movieId));
    }

    /** Authenticated — get the logged-in user's review for a specific movie */
    @GetMapping("/my")
    public ResponseEntity<?> getMyReview(@RequestParam Long movieId, Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        return ResponseEntity.ok(reviewService.getMyReviewForMovie(movieId, auth.getName()));
    }

    /** Authenticated — add a new review */
    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody ReviewRequest request, Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        return ResponseEntity.ok(reviewService.addReview(request, auth.getName()));
    }

    /** Authenticated — update own review */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(
            @PathVariable Long id,
            @RequestBody ReviewRequest request,
            Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        return ResponseEntity.ok(reviewService.updateReview(id, request, auth.getName()));
    }

    /** Authenticated — delete own review */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id, Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        reviewService.deleteReview(id, auth.getName());
        return ResponseEntity.ok("Review deleted successfully");
    }
}

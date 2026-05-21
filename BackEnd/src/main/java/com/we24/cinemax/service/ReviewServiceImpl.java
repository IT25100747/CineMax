package com.we24.cinemax.service;

import com.we24.cinemax.entity.Booking;
import com.we24.cinemax.entity.Movie;
import com.we24.cinemax.entity.Review;
import com.we24.cinemax.entity.User;
import com.we24.cinemax.model.ReviewRequest;
import com.we24.cinemax.model.ReviewResponse;
import com.we24.cinemax.repository.BookingRepository;
import com.we24.cinemax.repository.MovieRepository;
import com.we24.cinemax.repository.ReviewRepository;
import com.we24.cinemax.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final BookingRepository bookingRepository;

    private User getUser(String gmail) {
        return userRepository.findByGmail(gmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public ReviewResponse addReview(ReviewRequest request, String userEmail) {
        User user = getUser(userEmail);

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        // Prevent duplicate review (one per user per movie)
        if (reviewRepository.findByUser_GmailAndMovieId(userEmail, movie.getId()).isPresent()) {
            throw new RuntimeException("You have already reviewed this movie");
        }

        // Validate: user must have a confirmed booking with a past show date
        boolean hasWatched = bookingRepository.findByUser_GmailOrderByCreatedAtDesc(userEmail)
                .stream()
                .anyMatch(b -> b.getScreenTime().getMovie().getId().equals(movie.getId())
                        && b.getScreenTime().getShowDate() != null
                        && b.getScreenTime().getShowDate().isBefore(LocalDate.now()));

        if (!hasWatched) {
            throw new RuntimeException("You can only review movies you have watched");
        }

        // Validate rating
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        // Optional booking link
        Booking booking = null;
        if (request.getBookingId() != null) {
            booking = bookingRepository.findById(request.getBookingId()).orElse(null);
        }

        Review review = Review.builder()
                .user(user)
                .movie(movie)
                .booking(booking)
                .rating(request.getRating())
                .reviewText(request.getReviewText())
                .build();

        return ReviewResponse.fromEntity(reviewRepository.save(review));
    }

    @Override
    public List<ReviewResponse> getReviewsByMovie(Long movieId) {
        return reviewRepository.findByMovieIdOrderByCreatedAtDesc(movieId)
                .stream()
                .map(ReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public ReviewResponse updateReview(Long id, ReviewRequest request, String userEmail) {
        Review review = reviewRepository.findByIdAndUser_Gmail(id, userEmail)
                .orElseThrow(() -> new RuntimeException("Review not found or you don't have permission to edit it"));

        if (request.getRating() != null) {
            if (request.getRating() < 1 || request.getRating() > 5) {
                throw new RuntimeException("Rating must be between 1 and 5");
            }
            review.setRating(request.getRating());
        }

        if (request.getReviewText() != null) {
            review.setReviewText(request.getReviewText());
        }

        return ReviewResponse.fromEntity(reviewRepository.save(review));
    }

    @Override
    public void deleteReview(Long id, String userEmail) {
        Review review = reviewRepository.findByIdAndUser_Gmail(id, userEmail)
                .orElseThrow(() -> new RuntimeException("Review not found or you don't have permission to delete it"));
        reviewRepository.delete(review);
    }

    @Override
    public Optional<ReviewResponse> getMyReviewForMovie(Long movieId, String userEmail) {
        return reviewRepository.findByUser_GmailAndMovieId(userEmail, movieId)
                .map(ReviewResponse::fromEntity);
    }
}

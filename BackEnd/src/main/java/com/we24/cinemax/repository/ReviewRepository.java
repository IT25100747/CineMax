package com.we24.cinemax.repository;

import com.we24.cinemax.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMovieIdOrderByCreatedAtDesc(Long movieId);
    Optional<Review> findByUser_GmailAndMovieId(String gmail, Long movieId);
    Optional<Review> findByIdAndUser_Gmail(Long id, String gmail);
}

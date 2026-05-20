package com.we24.cinemax.repository;

import com.we24.cinemax.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser_GmailOrderByCreatedAtDesc(String gmail);
    Optional<Booking> findByBookingReference(String bookingReference);
    boolean existsByScreenTime_Movie_Id(Long movieId);
}

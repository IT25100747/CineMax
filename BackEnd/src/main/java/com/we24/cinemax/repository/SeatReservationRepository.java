package com.we24.cinemax.repository;

import com.we24.cinemax.entity.SeatReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatReservationRepository extends JpaRepository<SeatReservation, Long> {
    List<SeatReservation> findByScreenTimeId(Long screenTimeId);
    List<SeatReservation> findByBookingId(Long bookingId);
}

package com.we24.cinemax.service;

import com.we24.cinemax.entity.Booking;
import com.we24.cinemax.entity.ScreenTime;
import com.we24.cinemax.entity.SeatReservation;
import com.we24.cinemax.model.AdminBookingResponse;
import com.we24.cinemax.repository.BookingRepository;
import com.we24.cinemax.repository.SeatReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminBookingServiceImpl implements AdminBookingService {

    private final BookingRepository bookingRepository;
    private final SeatReservationRepository seatReservationRepository;

    @Override
    public List<AdminBookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream().map(booking -> {
            List<String> seats = seatReservationRepository.findByBookingId(booking.getId())
                    .stream()
                    .filter(res -> "RESERVED".equals(res.getStatus()))
                    .map(SeatReservation::getSeatNumber)
                    .collect(Collectors.toList());

            return AdminBookingResponse.builder()
                    .id(booking.getId())
                    .bookingReference(booking.getBookingReference())
                    .movieName(booking.getScreenTime().getMovie().getMovieName())
                    .showDate(booking.getScreenTime().getShowDate() != null ? booking.getScreenTime().getShowDate().toString() : null)
                    .showTime(booking.getScreenTime().getShowTime() != null ? booking.getScreenTime().getShowTime().toString() : null)
                    .screenTimeId(booking.getScreenTime().getId())
                    .screenNumber(booking.getScreenTime().getScreenNumber())
                    .customerName(booking.getGuestName())
                    .customerEmail(booking.getGuestEmail())
                    .seats(seats)
                    .totalAmount(booking.getTotalAmount())
                    .status(booking.getStatus())
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);

        List<SeatReservation> reservations = seatReservationRepository.findByBookingId(bookingId);
        for (SeatReservation reservation : reservations) {
            if ("RESERVED".equals(reservation.getStatus())) {
                reservation.setStatus("CANCELLED");
                seatReservationRepository.save(reservation);
            }
        }
    }

    @Override
    @Transactional
    public void updateBookingSeats(Long bookingId, List<String> newSeats) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        ScreenTime screenTime = booking.getScreenTime();

        // 1. Check if new seats are available (excluding the current booking's seats)
        List<SeatReservation> allReservations = seatReservationRepository.findByScreenTimeId(screenTime.getId());
        List<String> currentlyTakenSeats = allReservations.stream()
                .filter(res -> "RESERVED".equals(res.getStatus()) && !res.getBooking().getId().equals(bookingId))
                .map(SeatReservation::getSeatNumber)
                .collect(Collectors.toList());

        for (String seat : newSeats) {
            if (currentlyTakenSeats.contains(seat)) {
                throw new RuntimeException("Seat " + seat + " is already reserved by another booking.");
            }
        }

        // 2. Release old seats
        List<SeatReservation> existingMyReservations = seatReservationRepository.findByBookingId(bookingId);
        for (SeatReservation reservation : existingMyReservations) {
            reservation.setStatus("CANCELLED"); // Release the old ones
            seatReservationRepository.save(reservation);
        }

        // 3. Reserve new seats
        for (String seat : newSeats) {
            SeatReservation newReservation = SeatReservation.builder()
                    .booking(booking)
                    .screenTime(screenTime)
                    .seatNumber(seat)
                    .status("RESERVED")
                    .build();
            seatReservationRepository.save(newReservation);
        }
    }
}

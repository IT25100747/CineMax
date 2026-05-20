package com.we24.cinemax.service;

import com.we24.cinemax.entity.*;
import com.we24.cinemax.model.CheckoutRequest;
import com.we24.cinemax.model.CheckoutResponse;
import com.we24.cinemax.model.UpdateSeatsRequest;
import com.we24.cinemax.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final SeatReservationRepository seatReservationRepository;
    private final ScreenTimeRepository screenTimeRepository;
    private final UserRepository userRepository;
    private final PromoCodeRepository promoCodeRepository;

    @Override
    @Transactional
    public CheckoutResponse processBooking(CheckoutRequest request, String userEmail) {
        // 1. Fetch ScreenTime
        ScreenTime screenTime = screenTimeRepository.findById(request.getScreenTimeId())
                .orElseThrow(() -> new RuntimeException("ScreenTime not found"));

        // 2. Fetch User if authenticated
        User user = null;
        if (userEmail != null && !userEmail.isEmpty()) {
            user = userRepository.findByGmail(userEmail).orElse(null);
        }

        // 3. Verify Seats are not already booked
        List<SeatReservation> existingReservations = seatReservationRepository.findByScreenTimeId(screenTime.getId());
        List<String> bookedSeats = existingReservations.stream()
                .filter(res -> res.getStatus().equals("RESERVED"))
                .map(SeatReservation::getSeatNumber)
                .collect(Collectors.toList());

        for (String requestedSeat : request.getSeatNumbers()) {
            if (bookedSeats.contains(requestedSeat)) {
                throw new RuntimeException("Seat " + requestedSeat + " is already booked.");
            }
        }

        // 4. Verify Promo Code and calculate expected total
        double expectedTotal = (screenTime.getTicketPrice() * request.getSeatNumbers().size()) + 1.99;
        
        if (request.getPromoCode() != null && !request.getPromoCode().trim().isEmpty()) {
            PromoCode promoCode = promoCodeRepository.findByCode(request.getPromoCode().trim().toUpperCase())
                    .orElseThrow(() -> new RuntimeException("Invalid promo code"));
                    
            promoCode.updateStatusIfExpired();
            promoCodeRepository.save(promoCode); // Persist status update if any
            
            if (!promoCode.isValid()) {
                throw new RuntimeException("Promo code is no longer valid or has expired");
            }
            
            expectedTotal = promoCode.applyDiscount(expectedTotal);
        }

        // Verify total amount matches (allow tiny delta for float math)
        if (Math.abs(expectedTotal - request.getTotalAmount()) > 0.05) {
            throw new RuntimeException("Total amount mismatch. Expected: " + String.format("%.2f", expectedTotal) + ", but got: " + request.getTotalAmount());
        }

        // 5. Create Booking
        String bookingRef = "BKG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Booking booking = Booking.builder()
                .bookingReference(bookingRef)
                .user(user)
                .guestName(user != null ? user.getFullName() : request.getGuestName())
                .guestEmail(user != null ? user.getGmail() : request.getGuestEmail())
                .guestPhone(user != null ? user.getPhoneNumber() : request.getGuestPhone())
                .screenTime(screenTime)
                .totalAmount(request.getTotalAmount())
                .status("CONFIRMED")
                .build();
        booking = bookingRepository.save(booking);

        // 5. Create Seat Reservations
        for (String seatNum : request.getSeatNumbers()) {
            SeatReservation reservation = SeatReservation.builder()
                    .booking(booking)
                    .screenTime(screenTime)
                    .seatNumber(seatNum)
                    .status("RESERVED")
                    .build();
            seatReservationRepository.save(reservation);
        }

        // 6. Process Payment (Mock)
        Payment payment = Payment.builder()
                .booking(booking)
                .transactionId("TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase())
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CREDIT_CARD")
                .paidAmount(request.getTotalAmount())
                .paymentStatus("SUCCESS")
                .paymentTimestamp(LocalDateTime.now())
                .build();
        paymentRepository.save(payment);

        // 7. Return Response
        return CheckoutResponse.builder()
                .bookingId(booking.getId())
                .bookingReference(bookingRef)
                .status("SUCCESS")
                .message("Booking completed successfully")
                .build();
    }

    @Override
    public List<com.we24.cinemax.model.MyTicketResponse> getMyTickets(String gmail) {
        List<Booking> bookings = bookingRepository.findByUser_GmailOrderByCreatedAtDesc(gmail);
        return bookings.stream().map(booking -> {
            List<String> seats = seatReservationRepository.findByBookingId(booking.getId())
                    .stream()
                    .filter(res -> "RESERVED".equals(res.getStatus()))
                    .map(SeatReservation::getSeatNumber)
                    .collect(Collectors.toList());

            String showDate = booking.getScreenTime().getShowDate() != null ? booking.getScreenTime().getShowDate().toString() : "";
            String showTime = booking.getScreenTime().getShowTime() != null ? booking.getScreenTime().getShowTime().toString() : "";
            String hallName = "Hall " + booking.getScreenTime().getScreenNumber();
            String screenType = "IMAX"; 

            return com.we24.cinemax.model.MyTicketResponse.builder()
                    .internalBookingId(booking.getId())
                    .movieId(booking.getScreenTime().getMovie().getId())
                    .bookingId(booking.getBookingReference())
                    .movieName(booking.getScreenTime().getMovie().getMovieName())
                    .moviePoster(booking.getScreenTime().getMovie().getPosterUrl())
                    .showDate(showDate)
                    .showTime(showTime)
                    .hallName(hallName)
                    .screenType(screenType)
                    .seats(seats)
                    .totalPaid(booking.getTotalAmount())
                    .movieStatus(booking.getScreenTime().getMovie().getStatus())
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public com.we24.cinemax.model.MyTicketResponse getBookingByReference(String bookingReference) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        List<String> seats = seatReservationRepository.findByBookingId(booking.getId())
                .stream()
                .filter(res -> "RESERVED".equals(res.getStatus()))
                .map(SeatReservation::getSeatNumber)
                .collect(Collectors.toList());

        String showDate = booking.getScreenTime().getShowDate() != null ? booking.getScreenTime().getShowDate().toString() : "";
        String showTime = booking.getScreenTime().getShowTime() != null ? booking.getScreenTime().getShowTime().toString() : "";
        String hallName = "Hall " + booking.getScreenTime().getScreenNumber();
        String screenType = "IMAX";
        String movieName = booking.getScreenTime().getMovie().getMovieName();

        String qrData = String.format("%s | Seats: %s | Booking: %s | %s | %s %s",
                hallName, String.join(", ", seats), booking.getBookingReference(), movieName, showDate, showTime);

        return com.we24.cinemax.model.MyTicketResponse.builder()
                .internalBookingId(booking.getId())
                .movieId(booking.getScreenTime().getMovie().getId())
                .bookingId(booking.getBookingReference())
                .movieName(movieName)
                .moviePoster(booking.getScreenTime().getMovie().getPosterUrl())
                .showDate(showDate)
                .showTime(showTime)
                .hallName(hallName)
                .screenType(screenType)
                .seats(seats)
                .totalPaid(booking.getTotalAmount())
                .movieStatus(booking.getScreenTime().getMovie().getStatus())
                .qrCodeData(qrData)
                .build();
    }
    @Override
    public Map<String, Object> getAvailableSeats(String bookingReference, String userEmail) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Ownership check
        if (booking.getUser() == null || !booking.getUser().getGmail().equalsIgnoreCase(userEmail)) {
            throw new RuntimeException("Access denied: This booking does not belong to you");
        }

        Long screenTimeId = booking.getScreenTime().getId();

        // All reservations for this showtime
        List<SeatReservation> allReservations = seatReservationRepository.findByScreenTimeId(screenTimeId);

        // Seats reserved by THIS booking
        List<SeatReservation> myReservations = seatReservationRepository.findByBookingId(booking.getId());
        List<String> mySeats = myReservations.stream()
                .filter(r -> "RESERVED".equals(r.getStatus()))
                .map(SeatReservation::getSeatNumber)
                .collect(Collectors.toList());

        // Seats reserved by OTHER bookings (blocked)
        List<String> otherReservedSeats = allReservations.stream()
                .filter(r -> "RESERVED".equals(r.getStatus()))
                .filter(r -> !r.getBooking().getId().equals(booking.getId()))
                .map(SeatReservation::getSeatNumber)
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("bookingReference", bookingReference);
        result.put("screenTimeId", screenTimeId);
        result.put("currentSeats", mySeats);
        result.put("reservedByOthers", otherReservedSeats);
        result.put("ticketPrice", booking.getScreenTime().getTicketPrice());
        return result;
    }

    @Override
    @Transactional
    public com.we24.cinemax.model.MyTicketResponse updateSeats(String bookingReference, UpdateSeatsRequest request, String userEmail) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Ownership check
        if (booking.getUser() == null || !booking.getUser().getGmail().equalsIgnoreCase(userEmail)) {
            throw new RuntimeException("Access denied: This booking does not belong to you");
        }

        List<String> newSeats = request.getNewSeats();
        if (newSeats == null || newSeats.isEmpty()) {
            throw new RuntimeException("Please select at least one seat");
        }
        if (newSeats.size() != seatReservationRepository.findByBookingId(booking.getId()).stream()
                .filter(r -> "RESERVED".equals(r.getStatus())).count()) {
            throw new RuntimeException("You must select the same number of seats as originally booked");
        }

        // Check none of the new seats are reserved by another booking
        List<SeatReservation> allForShowtime = seatReservationRepository.findByScreenTimeId(booking.getScreenTime().getId());
        List<String> reservedByOthers = allForShowtime.stream()
                .filter(r -> "RESERVED".equals(r.getStatus()))
                .filter(r -> !r.getBooking().getId().equals(booking.getId()))
                .map(SeatReservation::getSeatNumber)
                .collect(Collectors.toList());

        for (String seat : newSeats) {
            if (reservedByOthers.contains(seat)) {
                throw new RuntimeException("Seat " + seat + " is already reserved by another booking");
            }
        }

        // Release old seats (delete them)
        List<SeatReservation> oldReservations = seatReservationRepository.findByBookingId(booking.getId());
        seatReservationRepository.deleteAll(oldReservations);

        // Reserve new seats
        for (String seatNum : newSeats) {
            SeatReservation reservation = SeatReservation.builder()
                    .booking(booking)
                    .screenTime(booking.getScreenTime())
                    .seatNumber(seatNum)
                    .status("RESERVED")
                    .build();
            seatReservationRepository.save(reservation);
        }

        // Return updated ticket
        return getBookingByReference(bookingReference);
    }
}

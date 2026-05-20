package com.we24.cinemax.controller;

import com.we24.cinemax.model.CheckoutRequest;
import com.we24.cinemax.model.CheckoutResponse;
import com.we24.cinemax.model.UpdateSeatsRequest;
import com.we24.cinemax.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> checkout(
            @RequestBody CheckoutRequest request,
            Authentication authentication
    ) {
        String email = null;
        if (authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")) {
            email = authentication.getName(); // In our JWT setup, name is usually the email/username
        }
        
        try {
            CheckoutResponse response = bookingService.processBooking(request, email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    CheckoutResponse.builder()
                            .status("FAILED")
                            .message(e.getMessage())
                            .build()
            );
        }
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<?> getMyTickets(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        String email = authentication.getName();
        try {
            return ResponseEntity.ok(bookingService.getMyTickets(email));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{reference}")
    public ResponseEntity<?> getBookingByReference(@PathVariable String reference) {
        try {
            return ResponseEntity.ok(bookingService.getBookingByReference(reference));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * GET available seat data for an existing booking (user-scoped).
     * Returns: currentSeats, reservedByOthers, screenTimeId.
     */
    @GetMapping("/{reference}/seats")
    public ResponseEntity<?> getAvailableSeats(@PathVariable String reference, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            return ResponseEntity.ok(bookingService.getAvailableSeats(reference, authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * PUT to update seats for an existing booking (user-scoped).
     * Validates ownership, seat availability, and swaps reservations atomically.
     */
    @PutMapping("/{reference}/seats")
    public ResponseEntity<?> updateSeats(
            @PathVariable String reference,
            @RequestBody UpdateSeatsRequest request,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            return ResponseEntity.ok(bookingService.updateSeats(reference, request, authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

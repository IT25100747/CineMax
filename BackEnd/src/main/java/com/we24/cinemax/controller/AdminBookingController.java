package com.we24.cinemax.controller;

import com.we24.cinemax.model.AdminBookingResponse;
import com.we24.cinemax.model.UpdateSeatsRequest;
import com.we24.cinemax.service.AdminBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
public class AdminBookingController {

    private final AdminBookingService adminBookingService;

    @GetMapping
    public ResponseEntity<List<AdminBookingResponse>> getAllBookings() {
        return ResponseEntity.ok(adminBookingService.getAllBookings());
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<String> cancelBooking(@PathVariable Long id) {
        try {
            adminBookingService.cancelBooking(id);
            return ResponseEntity.ok("Booking cancelled successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/seats")
    public ResponseEntity<String> updateBookingSeats(
            @PathVariable Long id,
            @RequestBody UpdateSeatsRequest request
    ) {
        try {
            adminBookingService.updateBookingSeats(id, request.getNewSeats());
            return ResponseEntity.ok("Seats updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

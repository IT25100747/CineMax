package com.we24.cinemax.service;

import com.we24.cinemax.model.AdminBookingResponse;

import java.util.List;

public interface AdminBookingService {
    List<AdminBookingResponse> getAllBookings();
    void cancelBooking(Long bookingId);
    void updateBookingSeats(Long bookingId, List<String> newSeats);
}

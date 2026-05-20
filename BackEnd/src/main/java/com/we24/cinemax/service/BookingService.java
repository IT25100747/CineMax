package com.we24.cinemax.service;

import com.we24.cinemax.model.CheckoutRequest;
import com.we24.cinemax.model.CheckoutResponse;
import com.we24.cinemax.model.MyTicketResponse;
import com.we24.cinemax.model.UpdateSeatsRequest;
import java.util.List;
import java.util.Map;

public interface BookingService {
    CheckoutResponse processBooking(CheckoutRequest request, String userEmail);
    List<MyTicketResponse> getMyTickets(String gmail);
    MyTicketResponse getBookingByReference(String bookingReference);
    Map<String, Object> getAvailableSeats(String bookingReference, String userEmail);
    MyTicketResponse updateSeats(String bookingReference, UpdateSeatsRequest request, String userEmail);
}

package com.we24.cinemax.model;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class MyTicketResponse {
    private Long internalBookingId;  // Internal DB id for review linking
    private Long movieId;            // For review API calls
    private String bookingId;        // Booking reference string
    private String movieName;
    private String moviePoster;
    private String showDate;
    private String showTime;
    private String hallName;
    private String screenType;
    private List<String> seats;
    private Double totalPaid;
    private String qrCodeData;
    private String movieStatus;
}

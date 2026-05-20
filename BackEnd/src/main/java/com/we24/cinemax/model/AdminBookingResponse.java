package com.we24.cinemax.model;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class AdminBookingResponse {
    private Long id;
    private String bookingReference;
    private String movieName;
    private String showDate;
    private String showTime;
    private Long screenTimeId;
    private Integer screenNumber;
    private String customerName;
    private String customerEmail;
    private List<String> seats;
    private Double totalAmount;
    private String status;
}

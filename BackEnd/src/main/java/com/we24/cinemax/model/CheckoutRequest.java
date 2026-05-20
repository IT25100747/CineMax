package com.we24.cinemax.model;

import lombok.Data;
import java.util.List;

@Data
public class CheckoutRequest {
    
    // Seat and movie details
    private Long screenTimeId;
    private List<String> seatNumbers;
    private Double totalAmount;
    private String promoCode;
    
    // Guest info (optional if logged in)
    private String guestName;
    private String guestEmail;
    private String guestPhone;
    
    // Payment details (For mock processing only - NOT STORED)
    private String cardNumber;
    private String cardExpiry;
    private String cardCvv;
    private String paymentMethod; // e.g., "CREDIT_CARD"
}

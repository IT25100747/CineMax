package com.we24.cinemax.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CheckoutResponse {
    private Long bookingId;
    private String bookingReference;
    private String status;
    private String message;
}

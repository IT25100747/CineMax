package com.we24.cinemax.model;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PromoCodeRequest {
    private String code;
    private Double discountPercentage;
    private LocalDate expiryDate;
    private String status;
}
